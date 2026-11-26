import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/http'
import { getOfferById } from './offerApi'
import type { PublicOffer } from './types'

export type OfferDetailStatus = 'idle' | 'success' | 'not-found' | 'error'

interface OfferDetailState {
  status: OfferDetailStatus
  offer: PublicOffer | null
  error: ApiError | null
  loading: boolean
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  return new ApiError(0, 'NETWORK_ERROR', 'No se pudo completar la solicitud.')
}

export function useOffer(offerId: string | undefined) {
  const [state, setState] = useState<OfferDetailState>({
    status: 'idle',
    offer: null,
    error: null,
    loading: false,
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!offerId) {
      setState({ status: 'idle', offer: null, error: null, loading: false })
      return
    }

    let active = true

    setState((current) => ({ ...current, loading: true, error: null }))

    getOfferById(offerId)
      .then((offer) => {
        if (active) setState({ status: 'success', offer, error: null, loading: false })
      })
      .catch((error: unknown) => {
        if (!active) return

        const apiError = toApiError(error)
        const isMissing =
          apiError.status === 404 ||
          (apiError.status === 400 && apiError.code === 'VALIDATION_ERROR')

        setState({
          status: isMissing ? 'not-found' : 'error',
          offer: null,
          error: apiError,
          loading: false,
        })
      })

    return () => {
      active = false
    }
  }, [offerId, attempt])

  const refetch = useCallback(() => {
    setAttempt((current) => current + 1)
    setState((current) => ({ ...current, loading: true, error: null }))
  }, [])

  return { ...state, refetch }
}
