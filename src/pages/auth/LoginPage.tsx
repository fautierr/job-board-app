import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { readAuthRedirectMessage } from '../../auth/redirectMessage'
import {
  getFieldErrors,
  getFormErrorMessage,
  normalizeEmail,
  validateLogin,
} from '../../auth/validation'
import type { FieldErrors } from '../../auth/validation'
import { FormField } from '../../components/forms/FormField'
import { FormMessage } from '../../components/forms/FormMessage'
import { useToast } from '../../components/toast/useToast'

type LoginField = 'email' | 'password'

export function LoginPage() {
  const { login } = useAuth()
  const toast = useToast()
  const location = useLocation()
  const [values, setValues] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [notice, setNotice] = useState<string | null>(() =>
    readAuthRedirectMessage(location.state),
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const message = readAuthRedirectMessage(location.state)
    if (message) setNotice(message)
  }, [location.state])

  const updateField = (field: LoginField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const errors = validateLogin(values)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)

    try {
      await login({ email: normalizeEmail(values.email), password: values.password })
      toast.success('Sesión iniciada correctamente.', { key: 'auth-login' })
    } catch (error) {
      toast.error(getFormErrorMessage(error, 'No se pudo iniciar sesión.'), {
        key: 'auth-login',
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
        Acceso
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Iniciar sesión
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Ingresá con tu cuenta para continuar.
      </p>

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
        {notice && <FormMessage>{notice}</FormMessage>}

        <FormField
          id="login-email"
          label="Email"
          type="email"
          value={values.email}
          onChange={(value) => updateField('email', value)}
          error={fieldErrors.email}
          autoComplete="email"
        />

        <FormField
          id="login-password"
          label="Contraseña"
          type="password"
          value={values.password}
          onChange={(value) => updateField('password', value)}
          error={fieldErrors.password}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-muted">
        ¿No tenés cuenta?{' '}
        <Link to="/register" className="font-medium text-accent hover:underline">
          Crear cuenta
        </Link>
      </p>
    </section>
  )
}
