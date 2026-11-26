import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/http'
import { getOffers } from './offerApi'
import type { OfferListResponse, OfferQuery } from './types'

interface OffersState {
  data: OfferListResponse | null
  loading: boolean
  error: ApiError | null
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  return new ApiError(0, 'NETWORK_ERROR', 'No se pudo completar la solicitud.')
}

export function useOffers(query: OfferQuery) {
  const { q, category, seniority, workMode, workday, contractType, page, limit } = query
  const [state, setState] = useState<OffersState>({ data: null, loading: true, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true

    setState((current) => ({ ...current, loading: true, error: null }))

    const currentQuery: OfferQuery = {
      q,
      category,
      seniority,
      workMode,
      workday,
      contractType,
      page,
      limit,
    }

    getOffers(currentQuery)
      .then((data) => {
        if (active) setState({ data, loading: false, error: null })
      })
      .catch((error: unknown) => {
        if (active) setState({ data: null, loading: false, error: toApiError(error) })
      })

    return () => {
      active = false
    }
  }, [q, category, seniority, workMode, workday, contractType, page, limit, attempt])

  const refetch = useCallback(() => {
    setAttempt((current) => current + 1)
    setState((current) => ({ ...current, loading: true, error: null }))
  }, [])

  return { ...state, refetch }
}
