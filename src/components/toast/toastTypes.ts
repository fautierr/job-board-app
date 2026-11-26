export type ToastTone = 'success' | 'error'

export interface ToastInput {
  message: string
  description?: string
  tone: ToastTone
  /** Identificador estable para evitar notificaciones duplicadas de una misma operación. */
  key?: string
  duration?: number
}

export interface ToastItem extends ToastInput {
  id: number
  key: string
}
