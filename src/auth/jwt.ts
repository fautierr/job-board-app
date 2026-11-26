function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const remainder = base64.length % 4
  const padding = remainder === 0 ? '' : '='.repeat(4 - remainder)

  return atob(base64 + padding)
}

export function getExpirationTime(token: string): number | null {
  const segments = token.split('.')

  if (segments.length !== 3) return null

  try {
    const payload: unknown = JSON.parse(decodeBase64Url(segments[1]))

    if (typeof payload !== 'object' || payload === null || !('exp' in payload)) {
      return null
    }

    const exp = payload.exp
    if (typeof exp !== 'number' || !Number.isFinite(exp)) return null

    return exp * 1000
  } catch {
    return null
  }
}
