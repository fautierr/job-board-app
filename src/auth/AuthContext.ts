import { createContext } from 'react'
import type { AuthIntent, AuthStatus, LoginRequest, PublicUser, RegisterRequest } from './types'

export interface AuthContextValue {
  status: AuthStatus
  user: PublicUser | null
  restoreError: string | null
  intent: AuthIntent | null
  login: (values: LoginRequest) => Promise<void>
  register: (values: RegisterRequest) => Promise<void>
  logout: () => void
  retry: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
