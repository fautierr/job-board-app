import type { FormEvent } from 'react'
import { FormField } from '../forms/FormField'
import { FormMessage } from '../forms/FormMessage'
import type { ApplicationField, ApplicationFieldErrors, ApplicationFormValues } from '../../applications/types'

interface ApplicationFormProps {
  values: ApplicationFormValues
  errors: ApplicationFieldErrors
  formError: string | null
  submitting: boolean
  onChange: (field: ApplicationField, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function ApplicationForm({
  values,
  errors,
  formError,
  submitting,
  onChange,
  onSubmit,
  onCancel,
}: ApplicationFormProps) {
  return (
    <form noValidate onSubmit={onSubmit} className="mt-4 space-y-3 border-t border-line pt-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        Datos de la postulación
      </p>

      {formError && <FormMessage>{formError}</FormMessage>}

      <FormField
        id="application-candidate-name"
        label="Nombre y apellido"
        value={values.candidateName}
        onChange={(value) => onChange('candidateName', value)}
        error={errors.candidateName}
        autoComplete="name"
        maxLength={120}
      />

      <FormField
        id="application-phone"
        label="Teléfono"
        value={values.phone}
        onChange={(value) => onChange('phone', value)}
        error={errors.phone}
        autoComplete="tel"
        maxLength={50}
      />

      <div className="flex flex-col gap-2 pt-1 sm:flex-row">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Enviando…' : 'Enviar postulación'}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={onCancel}
          className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
