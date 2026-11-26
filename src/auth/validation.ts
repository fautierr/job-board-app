import { ApiError } from '../api/http'
import type { LoginRequest, RegisterFormValues } from './types'

export interface FieldErrors {
  email?: string
  password?: string
  companyName?: string
  role?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

function validateEmail(value: string): string | undefined {
  const normalized = value.trim()

  if (!normalized) return 'Ingresá tu email.'
  if (!EMAIL_PATTERN.test(normalized)) return 'Ingresá un email válido.'

  return undefined
}

function validateLoginPassword(value: string): string | undefined {
  if (!value) return 'Ingresá tu contraseña.'
  if (value.length > 128) return 'La contraseña no puede superar los 128 caracteres.'

  return undefined
}

function validateRegisterPassword(value: string): string | undefined {
  if (!value || value.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }
  if (value.length > 128) return 'La contraseña no puede superar los 128 caracteres.'

  return undefined
}

export function validateLogin(values: LoginRequest): FieldErrors {
  const errors: FieldErrors = {}

  const emailError = validateEmail(values.email)
  if (emailError) errors.email = emailError

  const passwordError = validateLoginPassword(values.password)
  if (passwordError) errors.password = passwordError

  return errors
}

export function validateRegister(values: RegisterFormValues): FieldErrors {
  const errors: FieldErrors = {}

  const emailError = validateEmail(values.email)
  if (emailError) errors.email = emailError

  const passwordError = validateRegisterPassword(values.password)
  if (passwordError) errors.password = passwordError

  if (values.role === 'EMPLOYER') {
    const companyName = values.companyName.trim()

    if (!companyName) errors.companyName = 'Ingresá el nombre de la empresa.'
    if (companyName.length > 120) {
      errors.companyName = 'El nombre de la empresa no puede superar los 120 caracteres.'
    }
  }

  return errors
}

export function getFormErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return fallback

  switch (error.code) {
    case 'INVALID_CREDENTIALS':
      return 'Email o contraseña incorrectos.'
    case 'EMAIL_ALREADY_EXISTS':
      return 'Ya existe una cuenta con ese email.'
    case 'VALIDATION_ERROR':
      return 'Revisá los datos ingresados.'
    case 'NETWORK_ERROR':
      return 'No se pudo conectar con el servidor. Intentá nuevamente.'
    case 'INTERNAL_ERROR':
      return 'Ocurrió un error. Intentá nuevamente.'
    default:
      return fallback
  }
}

export function getFieldErrors(error: unknown): FieldErrors {
  if (!(error instanceof ApiError) || error.code !== 'VALIDATION_ERROR') return {}

  const errors: FieldErrors = {}

  for (const detail of error.details) {
    switch (detail.path) {
      case 'email':
        errors.email = 'Revisá el email.'
        break
      case 'password':
        errors.password = 'Revisá la contraseña.'
        break
      case 'companyName':
        errors.companyName = 'Revisá el nombre de la empresa.'
        break
      case 'role':
        errors.role = 'Seleccioná un tipo de cuenta válido.'
        break
      default:
        break
    }
  }

  return errors
}
