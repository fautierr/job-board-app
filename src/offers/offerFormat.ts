export function companyInitials(company: string): string {
  return company
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) return 'Fecha desconocida'

  const days = Math.round((Date.now() - date.getTime()) / 86_400_000)

  if (days <= 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`

  const weeks = Math.floor(days / 7)
  return weeks === 1 ? 'Hace 1 semana' : `Hace ${weeks} semanas`
}
