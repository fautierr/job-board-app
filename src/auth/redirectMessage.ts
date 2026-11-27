import type { UserRole } from './types'

export function readAuthRedirectMessage(state: unknown): string | null {
  if (typeof state !== 'object' || state === null || !('reason' in state)) {
    return null
  }

  switch (state.reason) {
    case 'expired':
      return 'Tu sesión expiró. Ingresá nuevamente para continuar.'
    case 'unauthorized':
      return 'Tu sesión no es válida. Ingresá nuevamente para continuar.'
    case 'remote-logout':
      return 'Cerraste sesión en otra pestaña.'
    default:
      return null
  }
}

/**
 * Reutiliza el `state.from` que ya usa RequireAuth para volver a la ruta que
 * originó el redirect. Solo se honoran rutas internas y accesibles por el rol
 * autenticado; cualquier otro valor cae al home correspondiente.
 */
export function readAuthRedirectPath(state: unknown, role: UserRole): string | null {
  if (typeof state !== 'object' || state === null || !('from' in state)) return null
  if (typeof state.from !== 'string') return null

  const from = state.from
  if (!from.startsWith('/') || from.startsWith('//') || from.includes('\\')) return null

  const pathname = from.split('?', 1)[0].split('#', 1)[0]
  if (pathname === '/login' || pathname === '/register') return null
  if (pathname.startsWith('/employer') && role !== 'EMPLOYER') return null
  if (pathname.startsWith('/candidate') && role !== 'CANDIDATE') return null

  return from
}
