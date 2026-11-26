import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeftIcon } from '../icons'
import { useToast } from '../toast/useToast'
import { OfferDetailPanel } from './OfferDetailPanel'
import { OfferDetailSkeleton } from './OfferDetailSkeleton'
import { OfferFilters } from './OfferFilters'
import { OfferListItem } from './OfferListItem'
import { OfferPagination } from './OfferPagination'
import { OfferStateNotice } from './OfferStateNotice'
import {
  clearFilters,
  hasActiveFilters,
  parseOfferQuery,
  serializeOfferQuery,
  setFilterValue,
  withPage,
  withSearch,
} from '../../offers/offerQuery'
import { useIsDesktop } from '../../offers/useIsDesktop'
import { useOffer } from '../../offers/useOffer'
import { useOffers } from '../../offers/useOffers'
import type { OfferFilterKey } from '../../offers/types'

interface OffersExplorerProps {
  offerId?: string
}

export function OffersExplorer({ offerId }: OffersExplorerProps) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { success: showSuccess, error: showError } = useToast()
  const isDesktop = useIsDesktop()

  const search = searchParams.toString()
  const query = useMemo(() => parseOfferQuery(new URLSearchParams(search)), [search])
  const [searchInput, setSearchInput] = useState(query.q)
  const [lastOfferId, setLastOfferId] = useState<string | undefined>()
  const [loadedSearch, setLoadedSearch] = useState<string | null>(null)
  const detailScrollRef = useRef<HTMLDivElement>(null)
  const pendingListRetryRef = useRef(false)
  const pendingDetailRetryRef = useRef(false)

  const list = useOffers(query)
  const previousListDataRef = useRef(list.data)
  const listMatchesSearch = loadedSearch === search
  const listHasFreshResult = listMatchesSearch && !list.error && list.data !== null
  const firstOfferId = isDesktop && listHasFreshResult ? list.data.offers[0]?.id : undefined
  const fallbackOfferId =
    isDesktop && !list.error && !listHasFreshResult ? lastOfferId : undefined
  const effectiveOfferId = offerId ?? firstOfferId ?? fallbackOfferId
  const detail = useOffer(effectiveOfferId)
  const activeFilters = hasActiveFilters(query)
  const outOfRange =
    list.data !== null &&
    !list.loading &&
    list.data.offers.length === 0 &&
    query.page > 1 &&
    list.data.pagination.total > 0

  const detailHasTerminalError = detail.status === 'not-found' || detail.status === 'error'
  const canShowDetailOffer =
    !detailHasTerminalError && detail.offer !== null && effectiveOfferId !== undefined
  const detailIsPending =
    !detailHasTerminalError && detail.offer === null && effectiveOfferId !== undefined
  const detailIsUpdating =
    !detailHasTerminalError &&
    (detail.loading ||
      (list.loading && detail.offer !== null) ||
      (detail.offer !== null && effectiveOfferId !== undefined && detail.offer.id !== effectiveOfferId))

  useEffect(() => {
    setSearchInput(query.q)
  }, [query.q])

  useEffect(() => {
    if (effectiveOfferId) {
      setLastOfferId(effectiveOfferId)
      return
    }

    if (listMatchesSearch && !list.error && list.data) {
      setLastOfferId(undefined)
    }
  }, [effectiveOfferId, listMatchesSearch, list.error, list.data])

  useEffect(() => {
    if (list.data === previousListDataRef.current) return

    previousListDataRef.current = list.data
    if (list.data && !list.error) {
      setLoadedSearch(search)
    }
  }, [list.data, list.error, search])

  useLayoutEffect(() => {
    if (!detailScrollRef.current) return
    detailScrollRef.current.scrollTop = 0
  }, [effectiveOfferId])

  useEffect(() => {
    if (!isDesktop || offerId || list.loading || list.error || !list.data) return
    if (loadedSearch !== search) return

    const first = list.data.offers[0]
    if (!first) return

    navigate(
      { pathname: `/offers/${encodeURIComponent(first.id)}`, search: location.search },
      { replace: true },
    )
  }, [
    isDesktop,
    offerId,
    list.loading,
    list.error,
    list.data,
    loadedSearch,
    navigate,
    location.search,
    search,
  ])

  useEffect(() => {
    const normalized = searchInput.trim().slice(0, 120)
    if (normalized === query.q) return

    const timer = window.setTimeout(() => {
      navigate(
        {
          pathname: '/offers',
          search: serializeOfferQuery(withSearch(query, searchInput)),
        },
        { replace: true },
      )
    }, 300)

    return () => window.clearTimeout(timer)
  }, [navigate, query, query.q, searchInput])

  useEffect(() => {
    if (!pendingListRetryRef.current || list.loading) return

    pendingListRetryRef.current = false
    if (list.error) {
      showError('No se pudo cargar el listado.', {
        key: 'offers-list-retry',
        description: 'Revisá tu conexión e intentá nuevamente.',
      })
    } else {
      showSuccess('Listado actualizado correctamente.', { key: 'offers-list-retry' })
    }
  }, [list.loading, list.error, list.data, showError, showSuccess])

  useEffect(() => {
    if (!pendingDetailRetryRef.current || detail.loading) return

    pendingDetailRetryRef.current = false
    if (detail.status === 'error') {
      showError('No se pudo cargar la oferta.', {
        key: 'offers-detail-retry',
        description: 'Revisá tu conexión e intentá nuevamente.',
      })
    } else if (detail.status === 'not-found') {
      showError('No encontramos esta oferta.', {
        key: 'offers-detail-retry',
        description: 'Puede que ya no esté publicada.',
      })
    } else if (detail.status === 'success') {
      showSuccess('Detalle actualizado correctamente.', { key: 'offers-detail-retry' })
    }
  }, [detail.loading, detail.status, showError, showSuccess])

  const handleSearchSubmit = () => {
    const normalized = searchInput.trim().slice(0, 120)
    if (normalized === query.q) return

    navigate({
      pathname: '/offers',
      search: serializeOfferQuery(withSearch(query, searchInput)),
    })
  }

  const handleFilterChange = (key: OfferFilterKey, value: string) => {
    navigate({
      pathname: '/offers',
      search: serializeOfferQuery(setFilterValue(query, key, value)),
    })
  }

  const handlePageChange = (page: number) => {
    navigate({
      pathname: '/offers',
      search: serializeOfferQuery(withPage(query, page)),
    })
  }

  const handleClearFilters = () => {
    navigate({
      pathname: '/offers',
      search: serializeOfferQuery(clearFilters(query)),
    })
  }

  const handleBack = () => {
    navigate({ pathname: '/offers', search: location.search })
  }

  const handleListRetry = () => {
    pendingListRetryRef.current = true
    list.refetch()
  }

  const handleDetailRetry = () => {
    pendingDetailRetryRef.current = true
    detail.refetch()
  }

  const renderList = () => {
    if (list.error) {
      return (
        <div className="p-3 sm:p-4">
          <OfferStateNotice
            title="No se pudo cargar el listado"
            description="Revisá tu conexión e intentá nuevamente."
            actionLabel="Reintentar"
            onAction={handleListRetry}
          />
        </div>
      )
    }

    if (!list.data) {
      if (list.loading) {
        return (
          <div className="p-3 sm:p-4">
            <OfferStateNotice
              title="Cargando ofertas"
              description="Estamos obteniendo las ofertas publicadas."
            />
          </div>
        )
      }

      return null
    }

    if (list.data.offers.length === 0) {
      return (
        <div className="p-3 sm:p-4">
          <OfferStateNotice
            title={outOfRange ? 'No hay resultados en esta página' : 'No encontramos ofertas'}
            description={
              outOfRange
                ? 'Probá con una página anterior o volvé a la primera.'
                : 'Probá con otros filtros o una búsqueda distinta.'
            }
            actionLabel={outOfRange ? 'Ir a la primera página' : 'Limpiar filtros'}
            onAction={outOfRange ? () => handlePageChange(1) : handleClearFilters}
          />
        </div>
      )
    }

    return (
      <ul aria-busy={list.loading}>
        {list.data.offers.map((offer) => (
          <OfferListItem
            key={offer.id}
            offer={offer}
            selected={offer.id === effectiveOfferId}
            detailHref={`/offers/${encodeURIComponent(offer.id)}${location.search}`}
          />
        ))}
      </ul>
    )
  }

  const renderDetail = () => {
    if (detail.status === 'not-found') {
      return (
        <OfferStateNotice
          title="No encontramos esta oferta"
          description="Puede que ya no esté publicada o que el enlace no sea válido."
          actionLabel="Volver al listado"
          onAction={handleBack}
        />
      )
    }

    if (detail.status === 'error') {
      return (
        <OfferStateNotice
          title="No se pudo cargar la oferta"
          description="Revisá tu conexión e intentá nuevamente."
          actionLabel="Reintentar"
          onAction={handleDetailRetry}
        />
      )
    }

    if (canShowDetailOffer && detail.offer) {
      return <OfferDetailPanel offer={detail.offer} isUpdating={detailIsUpdating} />
    }

    if (detailIsPending || (list.loading && !list.error)) {
      return <OfferDetailSkeleton />
    }

    if (list.error) {
      return (
        <OfferStateNotice
          title="No se pudo cargar el listado"
          description="Revisá tu conexión e intentá nuevamente."
          actionLabel="Reintentar"
          onAction={handleListRetry}
        />
      )
    }

    if (list.data && list.data.offers.length === 0) {
      return outOfRange ? (
        <OfferStateNotice
          title="No hay resultados en esta página"
          description="Probá con una página anterior o volvé a la primera."
          actionLabel="Ir a la primera página"
          onAction={() => handlePageChange(1)}
        />
      ) : (
        <OfferStateNotice
          title="No encontramos ofertas"
          description="Probá con otros filtros o una búsqueda distinta."
          actionLabel="Limpiar filtros"
          onAction={handleClearFilters}
        />
      )
    }

    return (
      <OfferStateNotice
        title="Seleccioná una oferta"
        description="Elegí una oferta del listado para ver todos los detalles."
      />
    )
  }

  return (
    <>
      <div
        className={`mb-5 items-end justify-between gap-4 ${
          offerId ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
            Ofertas publicadas
          </h1>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            Explorá las oportunidades disponibles y revisá los detalles antes de postularte.
          </p>
        </div>
        <p className="hidden shrink-0 text-xs text-muted sm:block">
          {list.data ? `${list.data.pagination.total} ofertas publicadas` : ''}
        </p>
      </div>

      <div
        id="offers-listado"
        className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-6"
      >
        <section
          aria-label="Listado de ofertas"
          className={`min-w-0 ${offerId ? 'hidden md:block' : 'block'}`}
        >
          <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-panel md:h-[calc(100vh-188px)] md:min-h-[520px]">
            <OfferFilters
              query={query}
              searchValue={searchInput}
              hasActiveFilters={activeFilters}
              onSearchChange={setSearchInput}
              onSearchSubmit={handleSearchSubmit}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            />

            <div
              className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]"
              aria-busy={list.loading}
            >
              {renderList()}
            </div>

            {list.data && !list.error && list.data.offers.length > 0 && (
              <OfferPagination
                pagination={list.data.pagination}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </section>

        <section
          aria-label="Detalle de la oferta"
          className={`min-w-0 ${offerId ? 'block' : 'hidden md:block'}`}
        >
          <div
            ref={detailScrollRef}
            className="md:sticky md:top-20 md:h-[calc(100vh-104px)] md:min-h-[520px] md:overflow-y-auto [scrollbar-gutter:stable] md:pr-1"
            aria-busy={detailIsUpdating || detailIsPending || (list.loading && !list.error)}
          >
            {offerId && (
              <button
                type="button"
                onClick={handleBack}
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-accent md:hidden"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Volver al listado
              </button>
            )}
            {renderDetail()}
          </div>
        </section>
      </div>
    </>
  )
}
