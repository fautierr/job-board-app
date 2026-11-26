import { ApiError } from '../api/http'
import {
  isCategory,
  isContractType,
  isSeniority,
  isWorkMode,
  isWorkday,
} from '../offers/offerOptions'
import type {
  ContractType,
  JobCategory,
  Seniority,
  WorkMode,
  Workday,
} from '../offers/types'
import type { EmployerOffer, OfferFieldErrors, OfferFormField, OfferFormValues, OfferPayload } from './types'

interface CompleteOfferFormValues {
  title: string
  description: string
  category: JobCategory
  seniority: Seniority
  workMode: WorkMode
  workday: Workday
  contractType: ContractType
}

export const emptyOfferFormValues: OfferFormValues = {
  title: '',
  description: '',
  category: '',
  seniority: '',
  workMode: '',
  workday: '',
  contractType: '',
}

export function toOfferFormValues(offer: EmployerOffer): OfferFormValues {
  return {
    title: offer.title,
    description: offer.description,
    category: offer.category,
    seniority: offer.seniority,
    workMode: offer.workMode,
    workday: offer.workday,
    contractType: offer.contractType,
  }
}

function isComplete(values: OfferFormValues): values is CompleteOfferFormValues {
  return (
    isCategory(values.category) &&
    isSeniority(values.seniority) &&
    isWorkMode(values.workMode) &&
    isWorkday(values.workday) &&
    isContractType(values.contractType)
  )
}

export function validateOfferForm(values: OfferFormValues): OfferFieldErrors {
  const errors: OfferFieldErrors = {}

  const title = values.title.trim()
  if (!title) errors.title = 'Ingresá el título de la oferta.'
  else if (title.length > 120) errors.title = 'El título no puede superar los 120 caracteres.'

  const description = values.description.trim()
  if (!description) errors.description = 'Ingresá la descripción de la oferta.'
  else if (description.length > 5000) {
    errors.description = 'La descripción no puede superar los 5000 caracteres.'
  }

  if (!values.category) errors.category = 'Seleccioná una categoría.'
  if (!values.seniority) errors.seniority = 'Seleccioná la experiencia.'
  if (!values.workMode) errors.workMode = 'Seleccioná la modalidad.'
  if (!values.workday) errors.workday = 'Seleccioná la jornada.'
  if (!values.contractType) errors.contractType = 'Seleccioná el tipo de contrato.'

  return errors
}

export type OfferFormResult =
  | { kind: 'success'; payload: OfferPayload }
  | { kind: 'error'; errors: OfferFieldErrors }

/** Valida y estrecha los tipos para construir un payload sin campos prohibidos. */
export function parseOfferForm(values: OfferFormValues): OfferFormResult {
  const errors = validateOfferForm(values)
  if (Object.keys(errors).length > 0) return { kind: 'error', errors }

  if (!isComplete(values)) {
    return { kind: 'error', errors: validateOfferForm(values) }
  }

  return {
    kind: 'success',
    payload: {
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category,
      seniority: values.seniority,
      workMode: values.workMode,
      workday: values.workday,
      contractType: values.contractType,
    },
  }
}

function isOfferFormField(value: unknown): value is OfferFormField {
  return (
    value === 'title' ||
    value === 'description' ||
    value === 'category' ||
    value === 'seniority' ||
    value === 'workMode' ||
    value === 'workday' ||
    value === 'contractType'
  )
}

const fieldMessages: Record<OfferFormField, string> = {
  title: 'Revisá el título.',
  description: 'Revisá la descripción.',
  category: 'Seleccioná una categoría válida.',
  seniority: 'Seleccioná una experiencia válida.',
  workMode: 'Seleccioná una modalidad válida.',
  workday: 'Seleccioná una jornada válida.',
  contractType: 'Seleccioná un tipo de contrato válido.',
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  return new ApiError(0, 'NETWORK_ERROR', 'No se pudo completar la solicitud.')
}

export function getOfferFieldErrors(error: unknown): OfferFieldErrors {
  if (!(error instanceof ApiError) || error.code !== 'VALIDATION_ERROR') return {}

  const errors: OfferFieldErrors = {}
  for (const detail of error.details) {
    if (isOfferFormField(detail.path)) {
      errors[detail.path] = fieldMessages[detail.path]
    }
  }

  return errors
}

export function getOfferFormErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return fallback

  switch (error.code) {
    case 'VALIDATION_ERROR':
      return 'Revisá los datos ingresados.'
    case 'UNAUTHORIZED':
      return 'Tu sesión no es válida. Iniciá sesión nuevamente.'
    case 'FORBIDDEN':
      return 'No tenés permisos para realizar esta acción.'
    case 'NOT_FOUND':
      return 'No encontramos la oferta o no es tuya.'
    case 'INVALID_STATUS_TRANSITION':
      return 'No se permite ese cambio de estado.'
    case 'NETWORK_ERROR':
      return 'No se pudo conectar con el servidor. Intentá nuevamente.'
    case 'INTERNAL_ERROR':
      return 'Ocurrió un error. Intentá nuevamente.'
    default:
      return fallback
  }
}
