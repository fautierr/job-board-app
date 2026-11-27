import { ApiError } from '../api/http'
import type {
  ApplicationField,
  ApplicationFieldErrors,
  ApplicationFormValues,
  ApplicationPayload,
} from './types'

export const emptyApplicationFormValues: ApplicationFormValues = {
  candidateName: '',
  phone: '',
}

export function validateApplicationForm(values: ApplicationFormValues): ApplicationFieldErrors {
  const errors: ApplicationFieldErrors = {}

  const candidateName = values.candidateName.trim()
  if (!candidateName) errors.candidateName = 'Ingresá tu nombre.'
  else if (candidateName.length > 120) errors.candidateName = 'El nombre no puede superar los 120 caracteres.'

  const phone = values.phone.trim()
  if (!phone) errors.phone = 'Ingresá tu teléfono.'
  else if (phone.length > 50) errors.phone = 'El teléfono no puede superar los 50 caracteres.'

  return errors
}

export type ApplicationFormResult =
  | { kind: 'success'; payload: ApplicationPayload }
  | { kind: 'error'; errors: ApplicationFieldErrors }

export function parseApplicationForm(
  values: ApplicationFormValues,
): ApplicationFormResult {
  const errors = validateApplicationForm(values)
  if (Object.keys(errors).length > 0) return { kind: 'error', errors }

  return {
    kind: 'success',
    payload: {
      candidateName: values.candidateName.trim(),
      phone: values.phone.trim(),
    },
  }
}

function isApplicationField(value: string): value is ApplicationField {
  return value === 'candidateName' || value === 'phone'
}

const fieldMessages: Record<ApplicationField, string> = {
  candidateName: 'Revisá el nombre.',
  phone: 'Revisá el teléfono.',
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  return new ApiError(0, 'NETWORK_ERROR', 'No se pudo completar la solicitud.')
}

export function getApplicationFieldErrors(error: unknown): ApplicationFieldErrors {
  if (!(error instanceof ApiError) || error.code !== 'VALIDATION_ERROR') return {}

  const errors: ApplicationFieldErrors = {}
  for (const detail of error.details) {
    if (isApplicationField(detail.path)) {
      errors[detail.path] = fieldMessages[detail.path]
    }
  }

  return errors
}

export function getApplicationFormErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return fallback

  switch (error.code) {
    case 'VALIDATION_ERROR':
      return 'Revisá los datos ingresados.'
    case 'ALREADY_APPLIED':
      return 'Ya te postulaste a esta oferta.'
    case 'NOT_FOUND':
      return 'La oferta ya no está disponible para postulaciones.'
    case 'UNAUTHORIZED':
      return 'Tu sesión no es válida. Iniciá sesión nuevamente.'
    case 'FORBIDDEN':
      return 'Solo los candidatos pueden postularse.'
    case 'NETWORK_ERROR':
      return 'No se pudo conectar con el servidor. Intentá nuevamente.'
    case 'INTERNAL_ERROR':
    case 'INVALID_RESPONSE':
      return 'Ocurrió un error. Intentá nuevamente.'
    default:
      return fallback
  }
}
