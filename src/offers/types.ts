export type JobCategory =
  | 'TECHNOLOGY_SYSTEMS'
  | 'ADMINISTRATION'
  | 'SALES_COMMERCIAL'
  | 'CUSTOMER_SERVICE'
  | 'MARKETING_COMMUNICATION'
  | 'DESIGN_MULTIMEDIA'
  | 'HUMAN_RESOURCES'
  | 'FINANCE_ACCOUNTING'
  | 'LOGISTICS_TRANSPORT'
  | 'PRODUCTION_OPERATIONS'
  | 'GASTRONOMY_TOURISM'
  | 'HEALTH'
  | 'EDUCATION'
  | 'CONSTRUCTION_TRADES'
  | 'LEGAL'
  | 'OTHER'

export type Seniority =
  | 'NO_EXPERIENCE'
  | 'TRAINEE'
  | 'JUNIOR'
  | 'SEMI_SENIOR'
  | 'SENIOR'
  | 'LEADER_MANAGER'

export type WorkMode = 'REMOTE' | 'ONSITE' | 'HYBRID'
export type Workday = 'FULL_TIME' | 'PART_TIME'

export type ContractType =
  | 'EMPLOYMENT'
  | 'TEMPORARY_CONTRACT'
  | 'FREELANCE_PROJECT'
  | 'INTERNSHIP'

export type OfferStatus = 'PUBLISHED' | 'PAUSED' | 'CLOSED'

export interface PublicOffer {
  id: string
  title: string
  description: string
  category: JobCategory
  seniority: Seniority
  workMode: WorkMode
  workday: Workday
  contractType: ContractType
  status: OfferStatus
  createdAt: string
  updatedAt: string
  companyName: string
}

export interface PaginationMetadata {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface OfferListResponse {
  offers: PublicOffer[]
  pagination: PaginationMetadata
}

export interface OfferDetailResponse {
  offer: PublicOffer
}

export interface OfferFilters {
  category: JobCategory | null
  seniority: Seniority | null
  workMode: WorkMode | null
  workday: Workday | null
  contractType: ContractType | null
}

export type OfferFilterKey = keyof OfferFilters

export interface OfferQuery extends OfferFilters {
  q: string
  page: number
  limit: number
}
