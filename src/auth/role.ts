import type { UserRole } from './types'

export function homeForRole(role: UserRole): string {
  return role === 'EMPLOYER' ? '/employer/offers' : '/offers'
}

export function roleLabel(role: UserRole): string {
  return role === 'EMPLOYER' ? 'Empleador' : 'Candidato'
}
