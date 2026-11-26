import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthNotice } from '../../components/auth/AuthNotice'
import { useAuth } from '../../auth/useAuth'

export function RequireAuth() {
  const { status, restoreError, retry, intent } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <AuthNotice title="Verificando sesión" description="Estamos comprobando tu acceso." />
  }

  if (status === 'error') {
    return (
      <AuthNotice
        title="No se pudo verificar la sesión"
        description={restoreError ?? 'No se pudo verificar la sesión.'}
        actionLabel="Reintentar"
        onAction={retry}
      />
    )
  }

  if (status === 'unauthenticated') {
    if (intent === 'logout') return null

    const navigationState = intent ? { reason: intent } : { from: location.pathname }

    return <Navigate to="/login" replace state={navigationState} />
  }

  return <Outlet />
}
