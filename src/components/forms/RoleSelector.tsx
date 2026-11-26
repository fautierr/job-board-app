import type { UserRole } from '../../auth/types'

interface RoleSelectorProps {
  value: UserRole
  onChange: (role: UserRole) => void
  error?: string
}

const ROLE_OPTIONS: readonly { value: UserRole; label: string; description: string }[] = [
  { value: 'CANDIDATE', label: 'Candidato', description: 'Buscá ofertas y postulate.' },
  { value: 'EMPLOYER', label: 'Empleador', description: 'Publicá y gestioná ofertas.' },
]

export function RoleSelector({ value, onChange, error }: RoleSelectorProps) {
  return (
    <fieldset>
      <legend className="text-xs font-medium text-ink">Tipo de cuenta</legend>

      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ROLE_OPTIONS.map((option) => {
          const selected = value === option.value

          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-lg border p-3 transition-colors focus-within:ring-2 focus-within:ring-accent/20 ${
                selected ? 'border-accent bg-accent/5' : 'border-line bg-surface'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className="block text-sm font-medium text-ink">{option.label}</span>
              <span className="mt-1 block text-[11px] leading-4 text-muted">
                {option.description}
              </span>
            </label>
          )
        })}
      </div>

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </fieldset>
  )
}
