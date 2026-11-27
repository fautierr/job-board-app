import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/http'
import { useAuth } from '../auth/useAuth'
import { getOfferApplications } from './applicationApi'
import { toApiError } from './applicationValidation'
import type { EmployerApplicationDto } from './types'

export function useOfferApplications(offerId: string | undefined) {
  const { token, handleUnauthorized } = useAuth()

  const [applications, setApplications] = useState<readonly EmployerApplicationDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const refetch = useCallback(() => {
    setAttempt((current) => current + 1)
  }, [])

  useEffect(() => {
    if (!offerId || !token) {
      setApplications([])
      setLoading(false)
      setError(null)
      setNotFound(false)
      return
    }

    let active = true
    setLoading(true)
    setError(null)
    setNotFound(false)

    getOfferApplications(token, offerId)
      .then((data) => {
        if (!active) return
        setApplications(data)
        setLoading(false)
      })
      .catch((reason: unknown) => {
        if (!active) return
        const apiError = toApiError(reason)
        if (apiError.status === 401) handleUnauthorized()

        setApplications([])
        if (apiError.status === 404) setNotFound(true)
        else setError(apiError)
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [offerId, token, attempt, handleUnauthorized])

  return { applications, loading, error, notFound, refetch }
}
