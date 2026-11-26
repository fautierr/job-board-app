import { Navigate, Outlet } from 'react-router-dom'
import { AuthNotice } from '../../components/auth/AuthNotice'
import { homeForRole } from '../../auth/role'
import { useAuth } from '../../auth/useAuth'

export function GuestOnly() {
  const { status, user } = useAuth()

  if (status === 'loading') {
    return <AuthNotice title="Verificando sesión" description="Estamos comprobando tu acceso." />
  }

  if (status === 'authenticated') {
    return <Navigate to={user ? homeForRole(user.role) : '/offers'} replace />
  }

  return <Outlet />
}
