import { useContext } from 'react'
import type { ContextType } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth(): NonNullable<ContextType<typeof AuthContext>> {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider.')
  }

  return context
}
