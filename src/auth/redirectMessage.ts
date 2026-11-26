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
