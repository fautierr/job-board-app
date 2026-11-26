import type { ApiError } from '../api/http'
import type {
  ContractType,
  JobCategory,
  OfferDto,
  Seniority,
  WorkMode,
  Workday,
} from '../offers/types'

/** Las rutas propias devuelven OfferDto, sin `companyName`. */
export type EmployerOffer = OfferDto

/** Los selects usan `''` para representar "sin seleccionar". */
export interface OfferFormValues {
  title: string
  description: string
  category: JobCategory | ''
  seniority: Seniority | ''
  workMode: WorkMode | ''
  workday: Workday | ''
  contractType: ContractType | ''
}

export type OfferFormField = keyof OfferFormValues
export type OfferFieldErrors = Partial<Record<OfferFormField, string>>

/** Únicos campos permitidos en POST /api/offers y PATCH /api/offers/:id. */
export interface OfferPayload {
  title: string
  description: string
  category: JobCategory
  seniority: Seniority
  workMode: WorkMode
  workday: Workday
  contractType: ContractType
}

export type MutationResult<T> =
  | { kind: 'success'; data: T }
  | { kind: 'error'; error: ApiError }
