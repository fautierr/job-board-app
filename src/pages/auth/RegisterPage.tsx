import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import {
  getFieldErrors,
  getFormErrorMessage,
  normalizeEmail,
  validateRegister,
} from '../../auth/validation'
import type { FieldErrors } from '../../auth/validation'
import type { RegisterFormValues, RegisterRequest, UserRole } from '../../auth/types'
import { FormField } from '../../components/forms/FormField'
import { RoleSelector } from '../../components/forms/RoleSelector'
import { useToast } from '../../components/toast/useToast'

type RegisterField = 'email' | 'password' | 'companyName'

const initialValues: RegisterFormValues = {
  email: '',
  password: '',
  role: 'CANDIDATE',
  companyName: '',
}

export function RegisterPage() {
  const { register } = useAuth()
  const toast = useToast()
  const [values, setValues] = useState<RegisterFormValues>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: RegisterField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
  }

  const updateRole = (role: UserRole) => {
    setValues((current) => ({
      ...current,
      role,
      companyName: role === 'CANDIDATE' ? '' : current.companyName,
    }))
    setFieldErrors((current) => ({ ...current, role: undefined, companyName: undefined }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const errors = validateRegister(values)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) return

    const base = { email: normalizeEmail(values.email), password: values.password }
    const request: RegisterRequest =
      values.role === 'EMPLOYER'
        ? { ...base, role: 'EMPLOYER', companyName: values.companyName.trim() }
        : { ...base, role: 'CANDIDATE' }

    setIsSubmitting(true)

    try {
      await register(request)
      toast.success('Cuenta creada correctamente.', { key: 'auth-register' })
    } catch (error) {
      toast.error(getFormErrorMessage(error, 'No se pudo crear la cuenta.'), {
        key: 'auth-register',
        description: 'Revisá los datos e intentá nuevamente.',
      })
      setFieldErrors(getFieldErrors(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
        Registro
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Crear cuenta
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Elegí el tipo de cuenta que querés crear.
      </p>

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
        <RoleSelector value={values.role} onChange={updateRole} error={fieldErrors.role} />

        <FormField
          id="register-email"
          label="Email"
          type="email"
          value={values.email}
          onChange={(value) => updateField('email', value)}
          error={fieldErrors.email}
          autoComplete="email"
        />

        <FormField
          id="register-password"
          label="Contraseña"
          type="password"
          value={values.password}
          onChange={(value) => updateField('password', value)}
          error={fieldErrors.password}
          hint="Mínimo 8 caracteres."
          autoComplete="new-password"
        />

        {values.role === 'EMPLOYER' && (
          <FormField
            id="register-company-name"
            label="Nombre de la empresa"
            value={values.companyName}
            onChange={(value) => updateField('companyName', value)}
            error={fieldErrors.companyName}
            autoComplete="organization"
            maxLength={120}
          />
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-muted">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="font-medium text-accent hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </section>
  )
}
