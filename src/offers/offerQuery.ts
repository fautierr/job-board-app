import {
  contractTypeOptions,
  seniorityOptions,
  workdayOptions,
  workModeOptions,
  categoryOptions,
} from './offerOptions'
import type {
  ContractType,
  JobCategory,
  OfferFilterKey,
  OfferQuery,
  Seniority,
  WorkMode,
  Workday,
} from './types'

function parseCategory(raw: string | null): JobCategory | null {
  return categoryOptions.find((option) => option.value === raw)?.value ?? null
}

function parseSeniority(raw: string | null): Seniority | null {
  return seniorityOptions.find((option) => option.value === raw)?.value ?? null
}

function parseWorkMode(raw: string | null): WorkMode | null {
  return workModeOptions.find((option) => option.value === raw)?.value ?? null
}

function parseWorkday(raw: string | null): Workday | null {
  return workdayOptions.find((option) => option.value === raw)?.value ?? null
}

function parseContractType(raw: string | null): ContractType | null {
  return contractTypeOptions.find((option) => option.value === raw)?.value ?? null
}

function parseInteger(raw: string | null, fallback: number, min: number, max?: number): number {
  if (raw === null) return fallback

  const value = Number(raw)
  if (!Number.isInteger(value) || value < min || (max !== undefined && value > max)) {
    return fallback
  }

  return value
}

export function parseOfferQuery(params: URLSearchParams): OfferQuery {
  const rawQ = params.get('q')?.trim() ?? ''

  return {
    q: rawQ.length > 0 && rawQ.length <= 120 ? rawQ : '',
    category: parseCategory(params.get('category')),
    seniority: parseSeniority(params.get('seniority')),
    workMode: parseWorkMode(params.get('workMode')),
    workday: parseWorkday(params.get('workday')),
    contractType: parseContractType(params.get('contractType')),
    page: parseInteger(params.get('page'), 1, 1),
    limit: parseInteger(params.get('limit'), 10, 1, 50),
  }
}

export function serializeOfferQuery(query: OfferQuery): string {
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

export function setFilterValue(
  query: OfferQuery,
  key: OfferFilterKey,
  rawValue: string,
): OfferQuery {
  switch (key) {
    case 'category':
      return { ...query, category: parseCategory(rawValue), page: 1 }
    case 'seniority':
      return { ...query, seniority: parseSeniority(rawValue), page: 1 }
    case 'workMode':
      return { ...query, workMode: parseWorkMode(rawValue), page: 1 }
    case 'workday':
      return { ...query, workday: parseWorkday(rawValue), page: 1 }
    case 'contractType':
      return { ...query, contractType: parseContractType(rawValue), page: 1 }
  }
}

export function withSearch(query: OfferQuery, rawValue: string): OfferQuery {
  return { ...query, q: rawValue.trim().slice(0, 120), page: 1 }
}

export function withPage(query: OfferQuery, page: number): OfferQuery {
  return { ...query, page: Math.max(1, Math.trunc(page)) }
}

export function clearFilters(query: OfferQuery): OfferQuery {
  return {
    q: '',
    category: null,
    seniority: null,
    workMode: null,
    workday: null,
    contractType: null,
    page: 1,
    limit: query.limit,
  }
}

export function hasActiveFilters(query: OfferQuery): boolean {
  return Boolean(
    query.q ||
      query.category ||
      query.seniority ||
      query.workMode ||
      query.workday ||
      query.contractType,
  )
}
