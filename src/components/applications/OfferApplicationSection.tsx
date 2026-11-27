import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRightIcon, CheckIcon } from '../icons'
import { AppliedBadge } from './AppliedBadge'
import { ApplicationForm } from './ApplicationForm'
import {
  emptyApplicationFormValues,
  getApplicationFieldErrors,
  getApplicationFormErrorMessage,
  parseApplicationForm,
} from '../../applications/applicationValidation'
import type {
  ApplicationField,
  ApplicationFieldErrors,
  ApplicationFormValues,
  ApplyApplicationResult,
  ApplicationPayload,
} from '../../applications/types'
import type { UserRole } from '../../auth/types'

interface OfferApplicationSectionProps {
  offerId: string
  viewerRole: UserRole | null
  applied: boolean
  applicationsLoading: boolean
  apply: (offerId: string, payload: ApplicationPayload) => Promise<ApplyApplicationResult>
}

export function OfferApplicationSection({
  offerId,
  viewerRole,
  applied,
  applicationsLoading,
  apply,
}: OfferApplicationSectionProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<ApplicationFormValues>(emptyApplicationFormValues)
  const [errors, setErrors] = useState<ApplicationFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleStart = () => {
    if (viewerRole === null) {
      const from = `/offers/${encodeURIComponent(offerId)}${location.search}`
      navigate('/login', { state: { from } })
      return
    }

    if (viewerRole === 'CANDIDATE' && !applied) setOpen(true)
  }

  const handleCancel = () => {
    setOpen(false)
    setValues(emptyApplicationFormValues)
    setErrors({})
    setFormError(null)
  }

  const handleChange = (field: ApplicationField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setFormError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = parseApplicationForm(values)
    if (parsed.kind === 'error') {
      setErrors(parsed.errors)
      setFormError('Revisá los datos ingresados.')
      return
    }

    setSubmitting(true)
    try {
      const result = await apply(offerId, parsed.payload)
      if (result.kind === 'success' || result.kind === 'already-applied') {
        handleCancel()
        return
      }

      setErrors(getApplicationFieldErrors(result.error))
      setFormError(getApplicationFormErrorMessage(result.error, 'No se pudo enviar la postulación.'))
    } finally {
      setSubmitting(false)
    }
  }

  const checkingApplications = viewerRole === 'CANDIDATE' && applicationsLoading

  if (viewerRole === 'EMPLOYER') return null

  if (checkingApplications) {
    return (
      <p role="status" className="text-xs text-muted">
        Verificando tus postulaciones…
      </p>
    )
  }

  if (applied) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <AppliedBadge />
          <span className="text-xs text-muted">Ya registraste tu postulación a esta oferta.</span>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-surface opacity-50 sm:w-auto sm:min-w-[176px]"
        >
          <CheckIcon className="h-4 w-4" />
          Ya postulado
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="hidden text-xs text-muted sm:block">
          {viewerRole === null
            ? 'Iniciá sesión como candidato para postularte.'
            : 'La postulación solicita nombre y teléfono.'}
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-surface transition-colors hover:bg-accent/90 sm:w-auto sm:min-w-[176px]"
        >
          Postularme
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <ApplicationForm
          values={values}
          errors={errors}
          formError={formError}
          submitting={submitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}
