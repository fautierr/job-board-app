import { ApiError, request } from '../api/http'
import {
  isCategory,
  isContractType,
  isSeniority,
  isWorkMode,
  isWorkday,
} from './offerOptions'
import type {
  OfferListResponse,
  OfferQuery,
  OfferStatus,
  PaginationMetadata,
  PublicOffer,
} from './types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isOfferStatus(value: unknown): value is OfferStatus {
  return value === 'PUBLISHED' || value === 'PAUSED' || value === 'CLOSED'
}

function invalidResponse(): ApiError {
  return new ApiError(
    0,
    'INVALID_RESPONSE',
    'La respuesta del servidor no es válida.',
  )
}

function parsePublicOffer(value: unknown): PublicOffer | null {
  if (!isRecord(value)) return null

  const {
    id,
    title,
    description,
    category,
    seniority,
    workMode,
    workday,
    contractType,
    status,
    createdAt,
    updatedAt,
    companyName,
  } = value

  if (
    typeof id !== 'string' ||
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    !isCategory(category) ||
    !isSeniority(seniority) ||
    !isWorkMode(workMode) ||
    !isWorkday(workday) ||
    !isContractType(contractType) ||
    !isOfferStatus(status) ||
    typeof createdAt !== 'string' ||
    typeof updatedAt !== 'string' ||
    typeof companyName !== 'string'
  ) {
    return null
  }

  return {
    id,
    title,
    description,
    category,
    seniority,
    workMode,
    workday,
    contractType,
    status,
    createdAt,
    updatedAt,
    companyName,
  }
}

function parsePagination(value: unknown): PaginationMetadata | null {
  if (!isRecord(value)) return null

  const { page, limit, total, totalPages, hasNext, hasPrevious } = value

  if (
    typeof page !== 'number' ||
    !Number.isInteger(page) ||
    typeof limit !== 'number' ||
    !Number.isInteger(limit) ||
    typeof total !== 'number' ||
    !Number.isInteger(total) ||
    typeof totalPages !== 'number' ||
    !Number.isInteger(totalPages) ||
    typeof hasNext !== 'boolean' ||
    typeof hasPrevious !== 'boolean'
  ) {
    return null
  }

  return { page, limit, total, totalPages, hasNext, hasPrevious }
}

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
