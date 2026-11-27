import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../api/http'
import { AuthContext } from '../../auth/AuthContext'
import type { LoginRequest } from '../../auth/types'
import { ToastProvider } from '../../components/toast/ToastProvider'
import { ToastViewport } from '../../components/toast/ToastViewport'
import { createAuthContextValue } from '../../test/authStub'
import { LoginPage } from './LoginPage'

function renderLoginPage(login: (values: LoginRequest) => Promise<void>) {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <ToastProvider>
        <AuthContext.Provider value={createAuthContextValue({ login })}>
          <LoginPage />
          <ToastViewport />
        </AuthContext.Provider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  it('inicia sesión con el email normalizado', async () => {
    const login = vi.fn(async () => {})
    renderLoginPage(login)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: '  Juan@Example.COM ' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'segura123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByText('Sesión iniciada correctamente.')).toBeTruthy()
    expect(login).toHaveBeenCalledWith({
      email: 'juan@example.com',
      password: 'segura123',
    })
  })

  it('muestra el error de credenciales inválidas', async () => {
    const login = vi.fn(async () => {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Credenciales inválidas.')
    })
    renderLoginPage(login)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'juan@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'incorrecta' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByText('Email o contraseña incorrectos.')).toBeTruthy()
  })
})
