import { request } from '../api/http'
import { parseOfferEnvelope, parseOfferListEnvelope } from '../offers/offerParsers'
import type { OfferStatus } from '../offers/types'
import type { EmployerOffer, OfferPayload } from './types'

export async function getMyOffers(token: string): Promise<EmployerOffer[]> {
  const payload = await request('/me/offers', { token })
  return parseOfferListEnvelope(payload)
}

export async function createOffer(
  token: string,
  payload: OfferPayload,
): Promise<EmployerOffer> {
  const response = await request('/offers', { method: 'POST', token, body: payload })
  return parseOfferEnvelope(response)
}

export async function updateOffer(
  token: string,
  offerId: string,
  payload: OfferPayload,
): Promise<EmployerOffer> {
  const response = await request(`/offers/${encodeURIComponent(offerId)}`, {
    method: 'PATCH',
    token,
    body: payload,
  })
  return parseOfferEnvelope(response)
}

export async function changeOfferStatus(
  token: string,
  offerId: string,
  status: OfferStatus,
): Promise<EmployerOffer> {
  const response = await request(`/offers/${encodeURIComponent(offerId)}/status`, {
    method: 'PATCH',
    token,
    body: { status },
  })
  return parseOfferEnvelope(response)
}
