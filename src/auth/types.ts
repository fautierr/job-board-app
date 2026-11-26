export type UserRole = 'EMPLOYER' | 'CANDIDATE'

export interface PublicUser {
  id: string
  email: string
  role: UserRole
}

export interface AuthResult {
  token: string
  user: PublicUser
}

export interface LoginRequest {
  email: string
  password: string
}

export type RegisterRequest =
  | { email: string; password: string; role: 'CANDIDATE' }
  | { email: string; password: string; role: 'EMPLOYER'; companyName: string }

export interface RegisterFormValues {
  email: string
  password: string
  role: UserRole
  companyName: string
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error'

export interface AuthState {
  status: AuthStatus
  token: string | null
  user: PublicUser | null
  error: string | null
  intent: AuthIntent | null
}

export type AuthRedirectReason = 'expired' | 'unauthorized' | 'remote-logout'
export type AuthIntent = 'logout' | AuthRedirectReason
