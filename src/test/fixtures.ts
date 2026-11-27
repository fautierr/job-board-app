import type { ApplicationDto } from '../applications/types'
import type { EmployerOffer } from '../employer/types'
import type { PublicOffer } from '../offers/types'

export function createPublicOffer(overrides: Partial<PublicOffer> = {}): PublicOffer {
  return {
    id: 'offer-1',
    title: 'Desarrollador React',
    description: 'Buscamos un desarrollador con experiencia en React.',
    category: 'TECHNOLOGY_SYSTEMS',
    seniority: 'JUNIOR',
    workMode: 'REMOTE',
    workday: 'FULL_TIME',
    contractType: 'EMPLOYMENT',
    status: 'PUBLISHED',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    companyName: 'Acme',
    ...overrides,
  }
}

export function createEmployerOffer(overrides: Partial<EmployerOffer> = {}): EmployerOffer {
  return {
    id: 'offer-1',
    title: 'Desarrollador React',
    description: 'Buscamos un desarrollador con experiencia en React.',
    category: 'TECHNOLOGY_SYSTEMS',
    seniority: 'JUNIOR',
    workMode: 'REMOTE',
    workday: 'FULL_TIME',
    contractType: 'EMPLOYMENT',
    status: 'PUBLISHED',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

export function createApplication(overrides: Partial<ApplicationDto> = {}): ApplicationDto {
  return {
    id: 'application-1',
    offerId: 'offer-1',
    candidateName: 'Juan Pérez',
    phone: '+5493415551234',
    createdAt: '2026-01-02T00:00:00.000Z',
    ...overrides,
  }
}
