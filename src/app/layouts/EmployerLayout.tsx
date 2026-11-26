import { roleLabel } from '../../auth/role'
import { useAuth } from '../../auth/useAuth'
import { AppShell } from './AppShell'
import type { ShellAction, ShellLink } from './shellTypes'

const navItems: readonly ShellLink[] = [
  { to: '/employer/offers', label: 'Mis ofertas' },
  { to: '/employer/offers/new', label: 'Nueva oferta', end: true },
  { to: '/offers', label: 'Ver ofertas públicas' },
]

export function EmployerLayout() {
  const { user, logout } = useAuth()
  const actions: readonly ShellAction[] = [{ label: 'Cerrar sesión', onClick: logout }]
  const userLabel = user ? `${user.email} · ${roleLabel(user.role)}` : null

  return <AppShell navItems={navItems} actions={actions} userLabel={userLabel} />
}
