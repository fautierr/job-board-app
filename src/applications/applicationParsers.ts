import { invalidResponse, isRecord } from '../offers/offerParsers'
import type { ApplicationDto, EmployerApplicationDto } from './types'

function parseBaseApplication(value: unknown): ApplicationDto | null {
  if (!isRecord(value)) return null

  const { id, offerId, candidateName, phone, createdAt } = value

  if (
    typeof id !== 'string' ||
    typeof offerId !== 'string' ||
    typeof candidateName !== 'string' ||
    typeof phone !== 'string' ||
    typeof createdAt !== 'string'
  ) {
    return null
  }

  return { id, offerId, candidateName, phone, createdAt }
}

export function parseApplicationDto(value: unknown): ApplicationDto | null {
  return parseBaseApplication(value)
}

export function parseEmployerApplicationDto(value: unknown): EmployerApplicationDto | null {
  const application = parseBaseApplication(value)
  if (!application || !isRecord(value) || typeof value.candidateId !== 'string') return null

  return { ...application, candidateId: value.candidateId }
}

export function parseApplicationEnvelope(payload: unknown): ApplicationDto {
  if (!isRecord(payload)) throw invalidResponse()

  const application = parseApplicationDto(payload.application)
  if (!application) throw invalidResponse()

  return application
}

export function parseApplicationListEnvelope(payload: unknown): ApplicationDto[] {
  if (!isRecord(payload) || !Array.isArray(payload.applications)) throw invalidResponse()

  const applications: ApplicationDto[] = []
  for (const item of payload.applications) {
    const application = parseApplicationDto(item)
    if (!application) throw invalidResponse()
    applications.push(application)
  }

  return applications
}

export function parseEmployerApplicationListEnvelope(payload: unknown): EmployerApplicationDto[] {
  if (!isRecord(payload) || !Array.isArray(payload.applications)) throw invalidResponse()

  const applications: EmployerApplicationDto[] = []
  for (const item of payload.applications) {
    const application = parseEmployerApplicationDto(item)
    if (!application) throw invalidResponse()
    applications.push(application)
  }

  return applications
}
