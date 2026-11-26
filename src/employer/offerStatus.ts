import type { OfferStatus } from '../offers/types'

export const offerStatusLabels: Record<OfferStatus, string> = {
  PUBLISHED: 'Publicada',
  PAUSED: 'Pausada',
  CLOSED: 'Cerrada',
}

/** Tabla de transiciones del contrato. El backend sigue siendo la autoridad. */
export function allowedStatusTransitions(status: OfferStatus): readonly OfferStatus[] {
  switch (status) {
    case 'PUBLISHED':
      return ['PAUSED', 'CLOSED']
    case 'PAUSED':
      return ['PUBLISHED', 'CLOSED']
    case 'CLOSED':
      return []
  }
}

export function statusActionLabel(status: OfferStatus): string {
  switch (status) {
    case 'PUBLISHED':
      return 'Publicar'
    case 'PAUSED':
      return 'Pausar'
    case 'CLOSED':
      return 'Cerrar'
  }
}

export function statusSuccessMessage(status: OfferStatus): string {
  switch (status) {
    case 'PUBLISHED':
      return 'Oferta publicada correctamente.'
    case 'PAUSED':
      return 'Oferta pausada correctamente.'
    case 'CLOSED':
      return 'Oferta cerrada correctamente.'
  }
}
