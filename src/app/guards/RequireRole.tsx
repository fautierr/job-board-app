import { Navigate, Outlet } from 'react-router-dom'
import { homeForRole } from '../../auth/role'
import { useAuth } from '../../auth/useAuth'
import type { UserRole } from '../../auth/types'

interface RequireRoleProps {
  roles: readonly UserRole[]
}

export function RequireRole({ roles }: RequireRoleProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={homeForRole(user.role)} replace />
  }

  return <Outlet />
}
