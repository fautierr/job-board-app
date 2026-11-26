import { roleLabel } from '../../auth/role'
import type { AuthStatus, PublicUser } from '../../auth/types'
import type { ShellAction, ShellLink } from './shellTypes'

const publicOffersLink: ShellLink = { to: '/offers', label: 'Ofertas' }
const guestActions: readonly ShellAction[] = [
  { to: '/login', label: 'Iniciar sesión' },
  { to: '/register', label: 'Crear cuenta', emphasis: true },
]

export interface ShellNavigation {
  navItems: readonly ShellLink[]
  actions: readonly ShellAction[]
  userLabel: string | null
}

/**
 * Única fuente de navegación del shell. Los layouts solo entregan el estado de
 * autenticación, así el encabezado no depende de la ruta ni se duplica entre
 * el panel público y los paneles autenticados.
 */
export function getShellNavigation(
  status: AuthStatus,
  user: PublicUser | null,
  logout: () => void,
): ShellNavigation {
  const authenticated = status === 'authenticated'
  const actions: readonly ShellAction[] = authenticated
    ? [{ label: 'Cerrar sesión', onClick: logout }]
    : guestActions

  const userLabel = authenticated && user ? `${user.email} · ${roleLabel(user.role)}` : null

  if (authenticated && user?.role === 'EMPLOYER') {
    return {
      navItems: [
        {
          to: '/employer/offers',
          label: 'Mis ofertas',
          end: true,
          activePaths: [
            '/employer/offers',
            '/employer/offers/:offerId/edit',
            '/employer/offers/:offerId/applications',
          ],
        },
        { to: '/employer/offers/new', label: 'Nueva oferta', end: true },
        { to: '/offers', label: 'Ofertas públicas' },
      ],
      actions,
      userLabel,
    }
  }

  if (authenticated && user?.role === 'CANDIDATE') {
    return {
      navItems: [
        publicOffersLink,
        { to: '/candidate/applications', label: 'Mis postulaciones' },
      ],
      actions,
      userLabel,
    }
  }

  return { navItems: [publicOffersLink], actions, userLabel }
}
