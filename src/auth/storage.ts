const TOKEN_KEY = 'jobboard.auth.token'

export function getTokenStorageKey(): string {
  return TOKEN_KEY
}

export function readToken(): string | null {
  try {
    const value = localStorage.getItem(TOKEN_KEY)
    return value && value.length > 0 ? value : null
  } catch {
    return null
  }
}

export function writeToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Si el almacenamiento no está disponible, la sesión continúa solo en memoria.
  }
}

export function removeToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // No hay nada que limpiar si el almacenamiento no está disponible.
  }
}
