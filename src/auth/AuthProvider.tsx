import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/http'
import { useToast } from '../components/toast/useToast'
import { getCurrentUser, login as loginRequest, register as registerRequest } from './authApi'
import { AuthContext } from './AuthContext'
import type { AuthContextValue } from './AuthContext'
import { getExpirationTime } from './jwt'
import { readAuthRedirectPath } from './redirectMessage'
import { homeForRole } from './role'
import { authReducer, initialAuthState } from './reducer'
import { getTokenStorageKey, readToken, removeToken, writeToken } from './storage'
import type { AuthRedirectReason, AuthResult, LoginRequest, RegisterRequest } from './types'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { success: showSuccess } = useToast()
  const [state, dispatch] = useReducer(authReducer, initialAuthState)

  const attemptRef = useRef(0)
  const tokenRef = useRef<string | null>(null)
  const expiryTimerRef = useRef<number | null>(null)
  const initialRestoreStartedRef = useRef(false)
  const stateRef = useRef(state)
  const locationRef = useRef(location.pathname)

  stateRef.current = state
  locationRef.current = location.pathname

  const clearExpiryTimer = useCallback(() => {
    if (expiryTimerRef.current !== null) {
      window.clearTimeout(expiryTimerRef.current)
      expiryTimerRef.current = null
    }
  }, [])

  const clearSessionAndRedirect = useCallback(
    (reason: AuthRedirectReason) => {
      navigate('/login', { replace: true, state: { reason } })
      removeToken()
      tokenRef.current = null
      clearExpiryTimer()
      dispatch({ type: 'SIGN_OUT', intent: reason })
    },
    [clearExpiryTimer, navigate],
  )

  const restoreWithToken = useCallback(
    async (token: string) => {
      const attempt = ++attemptRef.current
      tokenRef.current = token
      dispatch({ type: 'RESTORE_START', token })

      try {
        const user = await getCurrentUser(token)

        if (attempt !== attemptRef.current) return

        dispatch({ type: 'RESTORE_SUCCESS', token, user })
      } catch (error) {
        if (attempt !== attemptRef.current) return

        if (error instanceof ApiError && error.status === 401) {
          clearSessionAndRedirect('unauthorized')
          return
        }

        dispatch({ type: 'RESTORE_ERROR', message: 'No se pudo verificar la sesión.' })
      }
    },
    [clearSessionAndRedirect],
  )

  const commitSession = useCallback(
    (result: AuthResult) => {
      attemptRef.current += 1
      clearExpiryTimer()
      writeToken(result.token)
      tokenRef.current = result.token
      dispatch({ type: 'SIGN_IN', token: result.token, user: result.user })
      navigate(readAuthRedirectPath(location.state, result.user.role) ?? homeForRole(result.user.role), {
        replace: true,
      })
    },
    [clearExpiryTimer, location.state, navigate],
  )

  const login = useCallback(
    async (values: LoginRequest) => {
      const result = await loginRequest(values)
      commitSession(result)
    },
    [commitSession],
  )

  const register = useCallback(
    async (values: RegisterRequest) => {
      const result = await registerRequest(values)
      commitSession(result)
    },
    [commitSession],
  )

  const logout = useCallback(() => {
    navigate('/offers', { replace: true })
    attemptRef.current += 1
    removeToken()
    tokenRef.current = null
    clearExpiryTimer()
    dispatch({ type: 'SIGN_OUT', intent: 'logout' })
    showSuccess('Sesión cerrada correctamente.', { key: 'auth-logout' })
  }, [clearExpiryTimer, navigate, showSuccess])

  const retry = useCallback(() => {
    const token = tokenRef.current ?? readToken()

    if (!token) {
      dispatch({ type: 'SIGN_OUT' })
      return
    }

    void restoreWithToken(token)
  }, [restoreWithToken])

  const handleUnauthorized = useCallback(() => {
    clearSessionAndRedirect('unauthorized')
  }, [clearSessionAndRedirect])

  useEffect(() => {
    if (initialRestoreStartedRef.current) return

    initialRestoreStartedRef.current = true
    const token = readToken()

    if (!token) {
      dispatch({ type: 'RESTORE_START', token: null })
      return
    }

    void restoreWithToken(token)
  }, [restoreWithToken])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      const tokenKey = getTokenStorageKey()

      if (event.key !== tokenKey && event.key !== null) return

      const nextToken = event.key === null ? null : event.newValue

      if (!nextToken) {
        navigate('/login', { replace: true, state: { reason: 'remote-logout' } })
        attemptRef.current += 1
        tokenRef.current = null
        clearExpiryTimer()
        dispatch({ type: 'SIGN_OUT', intent: 'remote-logout' })
        return
      }

      if (nextToken === tokenRef.current && stateRef.current.status !== 'error') return
      void restoreWithToken(nextToken)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [clearExpiryTimer, navigate, restoreWithToken])

  useEffect(() => {
    const token = state.token

    if (!token) return

    clearExpiryTimer()
    const expiresAt = getExpirationTime(token)

    if (expiresAt === null) return

    const remaining = expiresAt - Date.now()
    if (remaining <= 0) {
      clearSessionAndRedirect('expired')
      return
    }

    expiryTimerRef.current = window.setTimeout(() => {
      clearSessionAndRedirect('expired')
    }, remaining)

    return clearExpiryTimer
  }, [state.token, clearExpiryTimer, clearSessionAndRedirect])

  useEffect(() => {
    if (!state.intent) return

    const target = state.intent === 'logout' ? '/offers' : '/login'
    if (location.pathname === target) {
      dispatch({ type: 'CLEAR_INTENT' })
    }
  }, [location.pathname, state.intent])

  const value = useMemo<AuthContextValue>(
    () => ({
      status: state.status,
      token: state.token,
      user: state.user,
      restoreError: state.error,
      intent: state.intent,
      login,
      register,
      logout,
      retry,
      handleUnauthorized,
    }),
    [
      state.status,
      state.token,
      state.user,
      state.error,
      state.intent,
      login,
      register,
      logout,
      retry,
      handleUnauthorized,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
