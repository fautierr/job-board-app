import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getOfferById } from '../offers/offerApi'
import { toApiError } from './applicationValidation'
import type { ApplicationDto, ApplicationOfferEntry } from './types'

export function useApplicationOffers(applications: readonly ApplicationDto[]) {
  const [entries, setEntries] = useState<Record<string, ApplicationOfferEntry>>({})
  const [attempt, setAttempt] = useState(0)
  const entriesRef = useRef<Record<string, ApplicationOfferEntry>>({})
  const inflightRef = useRef<Set<string>>(new Set())

  const offerIds = useMemo(
    () => Array.from(new Set(applications.map((application) => application.offerId))),
    [applications],
  )

  const updateEntry = useCallback((offerId: string, entry: ApplicationOfferEntry) => {
    entriesRef.current = { ...entriesRef.current, [offerId]: entry }
    setEntries(entriesRef.current)
  }, [])

  useEffect(() => {
    for (const offerId of offerIds) {
      const existing = entriesRef.current[offerId]
      if (existing && existing.status !== 'error') continue
      if (inflightRef.current.has(offerId)) continue

      inflightRef.current.add(offerId)
      updateEntry(offerId, { status: 'loading' })

      getOfferById(offerId)
        .then((offer) => {
          updateEntry(offerId, { status: 'available', offer })
        })
        .catch((reason: unknown) => {
          const apiError = toApiError(reason)
          if (apiError.status === 404) {
            updateEntry(offerId, { status: 'unavailable' })
            return
          }
          updateEntry(offerId, { status: 'error', error: apiError })
        })
        .finally(() => {
          inflightRef.current.delete(offerId)
        })
    }
  }, [offerIds, attempt, updateEntry])

  const retryOffer = useCallback((offerId: string) => {
    if (inflightRef.current.has(offerId)) return

    const next = { ...entriesRef.current }
    delete next[offerId]
    entriesRef.current = next
    setEntries(next)
    setAttempt((current) => current + 1)
  }, [])

  return { entries, retryOffer }
}
