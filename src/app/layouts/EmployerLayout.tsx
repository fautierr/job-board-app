import { useAuth } from '../../auth/useAuth'
import { AppShell } from './AppShell'
import { getShellNavigation } from './shellNavigation'

export function EmployerLayout() {
  const { status, user, logout } = useAuth()
  const { navItems, actions, userLabel } = getShellNavigation(status, user, logout)

  return <AppShell navItems={navItems} actions={actions} userLabel={userLabel} />
}
