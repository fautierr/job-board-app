import { createContext } from 'react'
import type { ToastInput, ToastItem } from './toastTypes'

export type ToastOptions = Pick<ToastInput, 'key' | 'duration' | 'description'>

export interface ToastContextValue {
  toasts: readonly ToastItem[]
  show: (input: ToastInput) => void
  success: (message: string, options?: ToastOptions) => void
  error: (message: string, options?: ToastOptions) => void
  dismiss: (id: number) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
