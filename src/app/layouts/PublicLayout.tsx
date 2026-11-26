import { useAuth } from '../../auth/useAuth'
import { roleLabel } from '../../auth/role'
import { AppShell } from './AppShell'
import type { ShellAction, ShellLink } from './shellTypes'

const navItems: readonly ShellLink[] = [{ to: '/offers', label: 'Ofertas' }]

const guestActions: readonly ShellAction[] = [
  { to: '/login', label: 'Iniciar sesión' },
  { to: '/register', label: 'Crear cuenta', emphasis: true },
]

export function PublicLayout() {
  const { status, user, logout } = useAuth()

  const actions: readonly ShellAction[] =
    status === 'authenticated'
      ? [{ label: 'Cerrar sesión', onClick: logout }]
      : guestActions

  const userLabel =
    status === 'authenticated' && user ? `${user.email} · ${roleLabel(user.role)}` : null

  return <AppShell navItems={navItems} actions={actions} userLabel={userLabel} />
}
