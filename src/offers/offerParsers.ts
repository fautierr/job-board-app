import { ApiError } from '../api/http'
import {
  isCategory,
  isContractType,
  isSeniority,
  isWorkMode,
  isWorkday,
} from './offerOptions'
import type { OfferDto, OfferStatus, PaginationMetadata, PublicOffer } from './types'

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isOfferStatus(value: unknown): value is OfferStatus {
  return value === 'PUBLISHED' || value === 'PAUSED' || value === 'CLOSED'
}

export function invalidResponse(): ApiError {
  return new ApiError(0, 'INVALID_RESPONSE', 'La respuesta del servidor no es válida.')
}

/** Parsea el OfferDto común a las respuestas públicas y propias. */
export function parseOfferDto(value: unknown): OfferDto | null {
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
    typeof updatedAt !== 'string'
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
  }
}

export function parsePublicOffer(value: unknown): PublicOffer | null {
  const offer = parseOfferDto(value)
  if (!offer || !isRecord(value) || typeof value.companyName !== 'string') return null

  return { ...offer, companyName: value.companyName }
}

export function parsePagination(value: unknown): PaginationMetadata | null {
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

export function parseOfferEnvelope(payload: unknown): OfferDto {
  if (!isRecord(payload)) throw invalidResponse()

  const offer = parseOfferDto(payload.offer)
  if (!offer) throw invalidResponse()

  return offer
}

export function parseOfferListEnvelope(payload: unknown): OfferDto[] {
  if (!isRecord(payload) || !Array.isArray(payload.offers)) throw invalidResponse()

  const offers: OfferDto[] = []
  for (const item of payload.offers) {
    const offer = parseOfferDto(item)
    if (!offer) throw invalidResponse()
    offers.push(offer)
  }

  return offers
}
