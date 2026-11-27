import type { AuthContextValue } from '../auth/AuthContext'

export function createAuthContextValue(
  overrides: Partial<AuthContextValue> = {},
): AuthContextValue {
  return {
    status: 'unauthenticated',
    token: null,
    user: null,
    restoreError: null,
    intent: null,
    login: async () => {},
    register: async () => {},
    logout: () => {},
    retry: () => {},
    handleUnauthorized: () => {},
    ...overrides,
  }
}
