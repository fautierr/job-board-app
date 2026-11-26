import { API_BASE_URL } from '../config'

export interface ApiErrorDetail {
  path: string
  message: string
}

export interface RequestOptions {
  method?: string
  body?: unknown
  token?: string
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details: readonly ApiErrorDetail[]

  constructor(
    status: number,
    code: string,
    message: string,
    details: readonly ApiErrorDetail[] = [],
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

function isApiErrorDetail(value: unknown): value is ApiErrorDetail {
  if (typeof value !== 'object' || value === null) return false
  if (!('path' in value) || !('message' in value)) return false

  return typeof value.path === 'string' && typeof value.message === 'string'
}

function toApiError(payload: unknown, status: number): ApiError {
  if (typeof payload === 'object' && payload !== null && 'error' in payload) {
    const error = payload.error

    if (typeof error === 'object' && error !== null) {
      let code = 'UNKNOWN_ERROR'
      if ('code' in error && typeof error.code === 'string') {
        code = error.code
      }

      let message = 'No se pudo completar la solicitud.'
      if ('message' in error && typeof error.message === 'string') {
        message = error.message
      }

      const details: ApiErrorDetail[] = []
      if ('details' in error && Array.isArray(error.details)) {
        for (const item of error.details) {
          if (isApiErrorDetail(item)) details.push(item)
        }
      }

      return new ApiError(status, code, message, details)
    }
  }

  return new ApiError(status, 'UNKNOWN_ERROR', 'No se pudo completar la solicitud.')
}

export async function request(path: string, options: RequestOptions = {}): Promise<unknown> {
  const headers: Record<string, string> = {}

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    })
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'No se pudo conectar con el servidor.')
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new ApiError(
      response.status,
      'INVALID_RESPONSE',
      'La respuesta del servidor no es válida.',
    )
  }

  if (!response.ok) {
    throw toApiError(payload, response.status)
  }

  return payload
}
