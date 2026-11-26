import { ApiError, request } from '../api/http'
import type { AuthResult, LoginRequest, PublicUser, RegisterRequest } from './types'

function isPublicUser(value: unknown): value is PublicUser {
  if (typeof value !== 'object' || value === null) return false
  if (!('id' in value) || !('email' in value) || !('role' in value)) return false

  return (
    typeof value.id === 'string' &&
    typeof value.email === 'string' &&
    (value.role === 'EMPLOYER' || value.role === 'CANDIDATE')
  )
}

function isAuthResult(value: unknown): value is AuthResult {
  if (typeof value !== 'object' || value === null) return false
  if (!('token' in value) || !('user' in value)) return false

  return typeof value.token === 'string' && isPublicUser(value.user)
}

function isUserEnvelope(value: unknown): value is { user: PublicUser } {
  if (typeof value !== 'object' || value === null || !('user' in value)) return false

  return isPublicUser(value.user)
}

function invalidResponse(): ApiError {
  return new ApiError(0, 'INVALID_RESPONSE', 'La respuesta del servidor no es válida.')
}

export async function login(values: LoginRequest): Promise<AuthResult> {
  const payload = await request('/auth/login', { method: 'POST', body: values })

  if (!isAuthResult(payload)) throw invalidResponse()

  return payload
}

export async function register(values: RegisterRequest): Promise<AuthResult> {
  const payload = await request('/auth/register', { method: 'POST', body: values })

  if (!isAuthResult(payload)) throw invalidResponse()

  return payload
}

export async function getCurrentUser(token: string): Promise<PublicUser> {
  const payload = await request('/auth/me', { method: 'GET', token })

  if (!isUserEnvelope(payload)) throw invalidResponse()

  return payload.user
}
