import { useContext } from 'react'
import type { ContextType } from 'react'
import { ToastContext } from './ToastContext'

export function useToast(): NonNullable<ContextType<typeof ToastContext>> {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider.')
  }

  return context
}
