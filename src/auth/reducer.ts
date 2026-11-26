import type { AuthIntent, AuthState, PublicUser } from './types'

export type AuthAction =
  | { type: 'RESTORE_START'; token: string | null }
  | { type: 'RESTORE_SUCCESS'; token: string; user: PublicUser }
  | { type: 'RESTORE_ERROR'; message: string }
  | { type: 'SIGN_IN'; token: string; user: PublicUser }
  | { type: 'SIGN_OUT'; intent?: AuthIntent }
  | { type: 'CLEAR_INTENT' }

export const initialAuthState: AuthState = {
  status: 'loading',
  token: null,
  user: null,
  error: null,
  intent: null,
}

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_START':
      if (!action.token) {
        return {
          status: 'unauthenticated',
          token: null,
          user: null,
          error: null,
          intent: null,
        }
      }

      return { status: 'loading', token: action.token, user: null, error: null, intent: null }

    case 'RESTORE_SUCCESS':
      return {
        status: 'authenticated',
        token: action.token,
        user: action.user,
        error: null,
        intent: null,
      }

    case 'RESTORE_ERROR':
      return { status: 'error', token: state.token, user: null, error: action.message, intent: null }

    case 'SIGN_IN':
      return {
        status: 'authenticated',
        token: action.token,
        user: action.user,
        error: null,
        intent: null,
      }

    case 'SIGN_OUT':
      return {
        status: 'unauthenticated',
        token: null,
        user: null,
        error: null,
        intent: action.intent ?? null,
      }

    case 'CLEAR_INTENT':
      return { ...state, intent: null }
  }
}
