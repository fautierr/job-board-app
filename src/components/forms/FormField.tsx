interface FormFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'email' | 'password' | 'text'
  error?: string
  hint?: string
  autoComplete?: string
  maxLength?: number
}

export function FormField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  error,
  hint,
  autoComplete,
  maxLength,
}: FormFieldProps) {
  const descriptionIds = [
    hint ? `${id}-hint` : null,
    error ? `${id}-error` : null,
  ].filter((item): item is string => item !== null)

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-ink">
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionIds.length > 0 ? descriptionIds.join(' ') : undefined}
        className={`mt-1.5 w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 transition-colors focus:outline-none ${
          error ? 'border-danger' : 'border-line focus:border-accent'
        }`}
      />

      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
