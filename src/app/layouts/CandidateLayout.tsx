import { roleLabel } from '../../auth/role'
import { useAuth } from '../../auth/useAuth'
import { AppShell } from './AppShell'
import type { ShellAction, ShellLink } from './shellTypes'

const navItems: readonly ShellLink[] = [
  { to: '/offers', label: 'Ofertas' },
  { to: '/candidate/applications', label: 'Mis postulaciones' },
]

export function CandidateLayout() {
  const { user, logout } = useAuth()
  const actions: readonly ShellAction[] = [{ label: 'Cerrar sesión', onClick: logout }]
  const userLabel = user ? `${user.email} · ${roleLabel(user.role)}` : null

  return <AppShell navItems={navItems} actions={actions} userLabel={userLabel} />
}
