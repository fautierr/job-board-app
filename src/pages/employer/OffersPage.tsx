import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '../../components/employer/ConfirmDialog'
import { EmployerOfferCard } from '../../components/employer/EmployerOfferCard'
import { OfferStateNotice } from '../../components/offers/OfferStateNotice'
import { useEmployerOffers } from '../../employer/useEmployerOffers'
import { getOfferFormErrorMessage } from '../../employer/offerFormValidation'
import type { EmployerOffer } from '../../employer/types'
import type { OfferStatus } from '../../offers/types'

function OffersSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="space-y-3">
      <span className="sr-only">Cargando ofertas</span>
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          aria-hidden="true"
          className="h-[168px] rounded-xl border border-line bg-surface p-5 shadow-panel"
        >
          <div className="h-4 w-2/5 rounded bg-line/40" />
          <div className="mt-3 h-3 w-1/5 rounded bg-line/40" />
          <div className="mt-6 h-5 w-3/5 rounded bg-line/40" />
          <div className="mt-6 h-8 w-full rounded bg-line/30" />
        </div>
      ))}
    </div>
  )
}

export function EmployerOffersPage() {
  const navigate = useNavigate()
  const { offers, loading, error, pendingId, refetch, changeStatus } = useEmployerOffers()
  const [closingOffer, setClosingOffer] = useState<EmployerOffer | null>(null)

  const handleStatusAction = useCallback(
    (offer: EmployerOffer, status: OfferStatus) => {
      if (status === 'CLOSED') {
        setClosingOffer(offer)
        return
      }

      void changeStatus(offer.id, status)
    },
    [changeStatus],
  )

  const handleConfirmClose = () => {
    if (!closingOffer) return

    const offerId = closingOffer.id
    void changeStatus(offerId, 'CLOSED').then(() => setClosingOffer(null))
  }

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
            Empleador
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Mis ofertas
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Gestioná tus ofertas publicadas, pausadas y cerradas.
          </p>
        </div>

        <Link
          to="/employer/offers/new"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent/90"
        >
          Nueva oferta
        </Link>
      </div>

      <div className="mt-7" aria-busy={loading}>
        {loading && <OffersSkeleton />}

        {!loading && error && (
          <OfferStateNotice
            title="No se pudo cargar el listado"
            description={getOfferFormErrorMessage(error, 'No se pudo cargar el listado.')}
            actionLabel="Reintentar"
            onAction={refetch}
          />
        )}

        {!loading && !error && offers.length === 0 && (
          <OfferStateNotice
            title="Todavía no creaste ofertas"
            description="Publicá tu primera oferta para empezar a recibir postulaciones."
            actionLabel="Crear mi primera oferta"
            onAction={() => navigate('/employer/offers/new')}
          />
        )}

        {!loading && !error && offers.length > 0 && (
          <ul className="space-y-3">
            {offers.map((offer) => (
              <EmployerOfferCard
                key={offer.id}
                offer={offer}
                pending={pendingId === offer.id}
                onStatusAction={handleStatusAction}
              />
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={closingOffer !== null}
        title="Cerrar oferta"
        description={`Vas a cerrar "${closingOffer?.title ?? ''}". Esta acción es irreversible: la oferta dejará de estar disponible y no podrá volver a publicarse.`}
        confirmLabel="Cerrar oferta"
        busy={closingOffer !== null && pendingId === closingOffer.id}
        onConfirm={handleConfirmClose}
        onCancel={() => setClosingOffer(null)}
      />
    </section>
  )
}
