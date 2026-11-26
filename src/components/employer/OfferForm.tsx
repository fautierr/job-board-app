import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  categoryOptions,
  contractTypeOptions,
  isCategory,
  isContractType,
  isSeniority,
  isWorkMode,
  isWorkday,
  seniorityOptions,
  workdayOptions,
  workModeOptions,
} from '../../offers/offerOptions'
import {
  emptyOfferFormValues,
  parseOfferForm,
} from '../../employer/offerFormValidation'
import type {
  OfferFieldErrors,
  OfferFormField,
  OfferFormValues,
  OfferPayload,
} from '../../employer/types'
import { FormField } from '../forms/FormField'
import { FormMessage } from '../forms/FormMessage'
import { FormSelectField } from '../forms/FormSelectField'

interface OfferFormProps {
  initialValues?: OfferFormValues
  serverErrors: OfferFieldErrors
  formError?: string | null
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (payload: OfferPayload) => void | Promise<void>
  onCancel: () => void
}

export function OfferForm({
  initialValues,
  serverErrors,
  formError,
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
}: OfferFormProps) {
  const [values, setValues] = useState<OfferFormValues>(
    initialValues ?? emptyOfferFormValues,
  )
  const [errors, setErrors] = useState<OfferFieldErrors>({})

  useEffect(() => {
    setErrors((current) => ({ ...current, ...serverErrors }))
  }, [serverErrors])

  const updateField = <K extends OfferFormField,>(
    field: K,
    value: OfferFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleCategory = (value: string) => {
    if (value === '' || isCategory(value)) updateField('category', value)
  }
  const handleSeniority = (value: string) => {
    if (value === '' || isSeniority(value)) updateField('seniority', value)
  }
  const handleWorkMode = (value: string) => {
    if (value === '' || isWorkMode(value)) updateField('workMode', value)
  }
  const handleWorkday = (value: string) => {
    if (value === '' || isWorkday(value)) updateField('workday', value)
  }
  const handleContractType = (value: string) => {
    if (value === '' || isContractType(value)) updateField('contractType', value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = parseOfferForm(values)
    if (result.kind === 'error') {
      setErrors(result.errors)
      return
    }

    setErrors({})
    void onSubmit(result.payload)
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      {formError && <FormMessage>{formError}</FormMessage>}

      <FormField
        id="offer-title"
        label="Título"
        value={values.title}
        onChange={(value) => updateField('title', value)}
        error={errors.title}
        maxLength={120}
        hint="Máximo 120 caracteres."
      />

      <FormField
        id="offer-description"
        label="Descripción"
        value={values.description}
        onChange={(value) => updateField('description', value)}
        error={errors.description}
        maxLength={5000}
        multiline
        hint="Máximo 5000 caracteres."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormSelectField
          id="offer-category"
          label="Categoría"
          value={values.category}
          options={categoryOptions}
          error={errors.category}
          onChange={handleCategory}
        />
        <FormSelectField
          id="offer-seniority"
          label="Experiencia"
          value={values.seniority}
          options={seniorityOptions}
          error={errors.seniority}
          onChange={handleSeniority}
        />
        <FormSelectField
          id="offer-work-mode"
          label="Modalidad"
          value={values.workMode}
          options={workModeOptions}
          error={errors.workMode}
          onChange={handleWorkMode}
        />
        <FormSelectField
          id="offer-workday"
          label="Jornada"
          value={values.workday}
          options={workdayOptions}
          error={errors.workday}
          onChange={handleWorkday}
        />
        <FormSelectField
          id="offer-contract-type"
          label="Tipo de contrato"
          value={values.contractType}
          options={contractTypeOptions}
          error={errors.contractType}
          onChange={handleContractType}
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Guardando…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
