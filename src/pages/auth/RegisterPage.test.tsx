import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../../auth/AuthContext'
import type { RegisterRequest } from '../../auth/types'
import { ToastProvider } from '../../components/toast/ToastProvider'
import { ToastViewport } from '../../components/toast/ToastViewport'
import { createAuthContextValue } from '../../test/authStub'
import { RegisterPage } from './RegisterPage'

function renderRegisterPage(register: (values: RegisterRequest) => Promise<void>) {
  render(
    <MemoryRouter initialEntries={['/register']}>
      <ToastProvider>
        <AuthContext.Provider value={createAuthContextValue({ register })}>
          <RegisterPage />
          <ToastViewport />
        </AuthContext.Provider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

function fillEmailAndPassword() {
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: '  Juan@Example.COM ' },
  })
  fireEvent.change(screen.getByLabelText('Contraseña'), {
    target: { value: 'segura123' },
  })
}

function submit() {
  fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
}

describe('RegisterPage', () => {
  it('valida email, contraseña y empresa según el rol', async () => {
    const register = vi.fn(async () => {})
    renderRegisterPage(register)

    fireEvent.click(screen.getByRole('radio', { name: /Empleador/ }))
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'no-es-un-email' },
    })
    submit()

    expect(await screen.findByText('Ingresá un email válido.')).toBeTruthy()
    expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeTruthy()
    expect(screen.getByText('Ingresá el nombre de la empresa.')).toBeTruthy()
    expect(register).not.toHaveBeenCalled()
  })

  it('registra un candidato sin enviar companyName', async () => {
    const register = vi.fn(async () => {})
    renderRegisterPage(register)

    expect(screen.queryByLabelText('Nombre de la empresa')).toBeNull()
    fillEmailAndPassword()
    submit()

    expect(await screen.findByText('Cuenta creada correctamente.')).toBeTruthy()
    expect(register).toHaveBeenCalledWith({
      email: 'juan@example.com',
      password: 'segura123',
      role: 'CANDIDATE',
    })
  })

  it('registra un empleador con el campo de empresa', async () => {
    const register = vi.fn(async () => {})
    renderRegisterPage(register)

    fireEvent.click(screen.getByRole('radio', { name: /Empleador/ }))
    fillEmailAndPassword()
    fireEvent.change(screen.getByLabelText('Nombre de la empresa'), {
      target: { value: '  Acme S.R.L.  ' },
    })
    submit()

    expect(await screen.findByText('Cuenta creada correctamente.')).toBeTruthy()
    expect(register).toHaveBeenCalledWith({
      email: 'juan@example.com',
      password: 'segura123',
      role: 'EMPLOYER',
      companyName: 'Acme S.R.L.',
    })
  })
})
