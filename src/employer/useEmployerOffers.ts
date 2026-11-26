import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/http'
import { useAuth } from '../auth/useAuth'
import { useToast } from '../components/toast/useToast'
import type { OfferStatus } from '../offers/types'
import {
  changeOfferStatus,
  createOffer,
  getMyOffers,
  updateOffer,
} from './employerOfferApi'
import { getOfferFormErrorMessage, toApiError } from './offerFormValidation'
import { statusSuccessMessage } from './offerStatus'
import type { EmployerOffer, MutationResult, OfferPayload } from './types'

interface UseEmployerOffersOptions {
  /** Permite usar las mutaciones en páginas que no necesitan el listado. */
  autoFetch?: boolean
}

interface MutationOptions {
  key: string
  pendingId: string
  fallback: string
  success: string
  action: (token: string) => Promise<EmployerOffer>
  apply: (offer: EmployerOffer) => void
}

export function useEmployerOffers(options: UseEmployerOffersOptions = {}) {
  const autoFetch = options.autoFetch ?? true
  const { token, handleUnauthorized } = useAuth()
  const toast = useToast()

  const [offers, setOffers] = useState<readonly EmployerOffer[]>([])
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<ApiError | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  const refetch = useCallback(() => {
    setAttempt((current) => current + 1)
  }, [])

  useEffect(() => {
    if (!autoFetch) {
      setLoading(false)
      return
    }

    if (!token) {
      setOffers([])
      setLoading(false)
      setError(null)
      return
    }

    let active = true
    setLoading(true)
    setError(null)

    getMyOffers(token)
      .then((data) => {
        if (!active) return
        setOffers(data)
        setLoading(false)
      })
      .catch((reason: unknown) => {
        if (!active) return
        setOffers([])
        setError(toApiError(reason))
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [autoFetch, token, attempt])

  const runMutation = useCallback(
    async (mutation: MutationOptions): Promise<MutationResult<EmployerOffer>> => {
      setPendingId(mutation.pendingId)

      try {
        if (!token) {
          throw new ApiError(
            401,
            'UNAUTHORIZED',
            'Tu sesión no es válida. Iniciá sesión nuevamente.',
          )
        }

        const offer = await mutation.action(token)
        mutation.apply(offer)
        toast.success(mutation.success, { key: mutation.key })
        return { kind: 'success', data: offer }
      } catch (reason) {
        const apiError = toApiError(reason)

        if (apiError.status === 401) handleUnauthorized()
        if (apiError.status === 404) refetch()

        toast.error(getOfferFormErrorMessage(apiError, mutation.fallback), {
          key: mutation.key,
        })
        return { kind: 'error', error: apiError }
      } finally {
        setPendingId(null)
      }
    },
    [token, handleUnauthorized, refetch, toast],
  )

  const create = useCallback(
    (payload: OfferPayload) =>
      runMutation({
        key: 'employer-offer-create',
        pendingId: 'new',
        fallback: 'No se pudo crear la oferta.',
        success: 'Oferta creada correctamente.',
        action: (currentToken) => createOffer(currentToken, payload),
        apply: (offer) =>
          setOffers((current) => [offer, ...current.filter((item) => item.id !== offer.id)]),
      }),
    [runMutation],
  )

  const update = useCallback(
    (offerId: string, payload: OfferPayload) =>
      runMutation({
        key: `employer-offer-update:${offerId}`,
        pendingId: offerId,
        fallback: 'No se pudo guardar la oferta.',
        success: 'Cambios guardados correctamente.',
        action: (currentToken) => updateOffer(currentToken, offerId, payload),
        apply: (offer) =>
          setOffers((current) => current.map((item) => (item.id === offer.id ? offer : item))),
      }),
    [runMutation],
  )

  const changeStatus = useCallback(
    (offerId: string, status: OfferStatus) =>
      runMutation({
        key: `employer-offer-status:${offerId}`,
        pendingId: offerId,
        fallback: 'No se pudo cambiar el estado de la oferta.',
        success: statusSuccessMessage(status),
        action: (currentToken) => changeOfferStatus(currentToken, offerId, status),
        apply: (offer) =>
          setOffers((current) => current.map((item) => (item.id === offer.id ? offer : item))),
      }),
    [runMutation],
  )

  return {
    offers,
    loading,
    error,
    pendingId,
    refetch,
    create,
    update,
    changeStatus,
  }
}
