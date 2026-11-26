import { ChevronDownIcon } from '../icons'
import type { FilterOption } from '../../offers/offerOptions'

interface FormSelectFieldProps {
  id: string
  label: string
  value: string
  options: readonly FilterOption[]
  placeholder?: string
  error?: string
  onChange: (value: string) => void
}

export function FormSelectField({
  id,
  label,
  value,
  options,
  placeholder = 'Seleccioná una opción',
  error,
  onChange,
}: FormSelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-ink">
        {label}
      </label>

      <div className="relative mt-1.5">
        <select
          id={id}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full appearance-none rounded-lg border bg-surface py-2.5 pl-3 pr-8 text-sm text-ink transition-colors focus:outline-none ${
            error ? 'border-danger' : 'border-line focus:border-accent'
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
