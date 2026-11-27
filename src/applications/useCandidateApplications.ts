import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApiError } from '../api/http'
import { useAuth } from '../auth/useAuth'
import { useToast } from '../components/toast/useToast'
import { createApplication, getMyApplications } from './applicationApi'
import { getApplicationFormErrorMessage, toApiError } from './applicationValidation'
import type { ApplicationDto, ApplicationPayload, ApplyApplicationResult } from './types'

export function useCandidateApplications() {
  const { token, user, handleUnauthorized } = useAuth()
  const toast = useToast()

  const [applications, setApplications] = useState<readonly ApplicationDto[]>([])
  const [appliedOfferIds, setAppliedOfferIds] = useState<readonly string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [attempt, setAttempt] = useState(0)

  const isCandidate = user?.role === 'CANDIDATE'

  const refetch = useCallback(() => {
    setAttempt((current) => current + 1)
  }, [])

  useEffect(() => {
    if (!isCandidate || !token) {
      setApplications([])
      setAppliedOfferIds([])
      setLoading(false)
      setError(null)
      return
    }

    let active = true
    setLoading(true)
    setError(null)

    getMyApplications(token)
      .then((data) => {
        if (!active) return
        setApplications(data)
        setAppliedOfferIds(data.map((application) => application.offerId))
        setLoading(false)
      })
      .catch((reason: unknown) => {
        if (!active) return
        const apiError = toApiError(reason)
        if (apiError.status === 401) handleUnauthorized()
        setApplications([])
        setAppliedOfferIds([])
        setError(apiError)
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [isCandidate, token, attempt, handleUnauthorized])

  const apply = useCallback(
    async (offerId: string, payload: ApplicationPayload): Promise<ApplyApplicationResult> => {
      const key = `application-create:${offerId}`

      if (!token) {
        const apiError = new ApiError(
          401,
          'UNAUTHORIZED',
          'Tu sesión no es válida. Iniciá sesión nuevamente.',
        )
        handleUnauthorized()
        return { kind: 'error', error: apiError }
      }

      try {
        const application = await createApplication(token, offerId, payload)

        setApplications((current) => [
          application,
          ...current.filter((item) => item.id !== application.id),
        ])
        setAppliedOfferIds((current) =>
          current.includes(offerId) ? current : [...current, offerId],
        )
        toast.success('Postulación enviada correctamente.', { key })
        return { kind: 'success', application }
      } catch (reason) {
        const apiError = toApiError(reason)

        if (apiError.status === 401) handleUnauthorized()

        if (apiError.code === 'ALREADY_APPLIED') {
          setAppliedOfferIds((current) =>
            current.includes(offerId) ? current : [...current, offerId],
          )
          toast.success('Ya te habías postulado a esta oferta.', {
            key: `application-already:${offerId}`,
          })
          return { kind: 'already-applied' }
        }

        toast.error(getApplicationFormErrorMessage(apiError, 'No se pudo enviar la postulación.'), {
          key,
          description:
            apiError.code === 'VALIDATION_ERROR' ? 'Revisá los datos ingresados.' : undefined,
        })
        return { kind: 'error', error: apiError }
      }
    },
    [token, handleUnauthorized, toast],
  )

  const appliedSet = useMemo(
    () => new Set<string>([...appliedOfferIds, ...applications.map((item) => item.offerId)]),
    [appliedOfferIds, applications],
  )

  return { applications, appliedOfferIds: appliedSet, loading, error, refetch, apply }
}
