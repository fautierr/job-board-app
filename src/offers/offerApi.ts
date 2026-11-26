import { request } from '../api/http'
import {
  invalidResponse,
  isRecord,
  parsePagination,
  parsePublicOffer,
} from './offerParsers'
import type { OfferListResponse, OfferQuery, PublicOffer } from './types'

function buildQueryString(query: OfferQuery): string {
  const params = new URLSearchParams()

  params.set('page', String(query.page))
  params.set('limit', String(query.limit))

  if (query.q) params.set('q', query.q)
  if (query.category) params.set('category', query.category)
  if (query.seniority) params.set('seniority', query.seniority)
  if (query.workMode) params.set('workMode', query.workMode)
  if (query.workday) params.set('workday', query.workday)
  if (query.contractType) params.set('contractType', query.contractType)

  return params.toString()
}

export async function getOffers(query: OfferQuery): Promise<OfferListResponse> {
  const payload = await request(`/offers?${buildQueryString(query)}`)

  if (!isRecord(payload) || !Array.isArray(payload.offers)) {
    throw invalidResponse()
  }

  const pagination = parsePagination(payload.pagination)
  if (!pagination) throw invalidResponse()

  const offers: PublicOffer[] = []
  for (const item of payload.offers as unknown[]) {
    const offer = parsePublicOffer(item)
    if (!offer) throw invalidResponse()
    offers.push(offer)
  }

  return { offers, pagination }
}

export async function getOfferById(id: string): Promise<PublicOffer> {
  const payload: unknown = await request(`/offers/${encodeURIComponent(id)}`)

  if (!isRecord(payload)) throw invalidResponse()

  const offer = parsePublicOffer(payload.offer)
  if (!offer) throw invalidResponse()

  return offer
}
