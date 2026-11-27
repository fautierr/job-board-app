import { request } from '../api/http'
import type { ApplicationPayload } from './types'
import {
  parseApplicationEnvelope,
  parseApplicationListEnvelope,
  parseEmployerApplicationListEnvelope,
} from './applicationParsers'
import type { ApplicationDto, EmployerApplicationDto } from './types'

export async function getMyApplications(token: string): Promise<ApplicationDto[]> {
  const payload = await request('/me/applications', { token })
  return parseApplicationListEnvelope(payload)
}

export async function createApplication(
  token: string,
  offerId: string,
  payload: ApplicationPayload,
): Promise<ApplicationDto> {
  const response = await request(`/offers/${encodeURIComponent(offerId)}/applications`, {
    method: 'POST',
    token,
    body: payload,
  })
  return parseApplicationEnvelope(response)
}

export async function getOfferApplications(
  token: string,
  offerId: string,
): Promise<EmployerApplicationDto[]> {
  const payload = await request(`/offers/${encodeURIComponent(offerId)}/applications`, {
    token,
  })
  return parseEmployerApplicationListEnvelope(payload)
}
