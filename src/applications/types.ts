import type { ApiError } from '../api/http'
import type { PublicOffer } from '../offers/types'

export interface ApplicationDto {
  id: string
  offerId: string
  candidateName: string
  phone: string
  createdAt: string
}

export interface EmployerApplicationDto extends ApplicationDto {
  candidateId: string
}

export interface ApplicationFormValues {
  candidateName: string
  phone: string
}

export type ApplicationPayload = ApplicationFormValues
export type ApplicationField = keyof ApplicationFormValues
export type ApplicationFieldErrors = Partial<Record<ApplicationField, string>>

export type ApplyApplicationResult =
  | { kind: 'success'; application: ApplicationDto }
  | { kind: 'already-applied' }
  | { kind: 'error'; error: ApiError }

export type ApplicationOfferEntry =
  | { status: 'loading' }
  | { status: 'available'; offer: PublicOffer }
  | { status: 'unavailable' }
  | { status: 'error'; error: ApiError }
