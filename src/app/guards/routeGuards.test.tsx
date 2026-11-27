import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthContext } from '../../auth/AuthContext'
import type { PublicUser } from '../../auth/types'
import { createAuthContextValue } from '../../test/authStub'
import { RequireAuth } from './RequireAuth'
import { RequireRole } from './RequireRole'

describe('guards de ruta', () => {
  it('redirige a login cuando no hay sesión', async () => {
    render(
      <AuthContext.Provider value={createAuthContextValue({ status: 'unauthenticated' })}>
        <MemoryRouter initialEntries={['/candidate/applications']}>
          <Routes>
            <Route element={<RequireAuth />}>
              <Route path="/candidate/applications" element={<p>Área privada</p>} />
            </Route>
            <Route path="/login" element={<p>Iniciar sesión</p>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    )

    expect(await screen.findByText('Iniciar sesión')).toBeTruthy()
    expect(screen.queryByText('Área privada')).toBeNull()
  })

  it('redirige al inicio del candidato si su rol no permite la ruta', async () => {
    const user: PublicUser = {
      id: 'user-1',
      email: 'candidate@example.com',
      role: 'CANDIDATE',
    }

    render(
      <AuthContext.Provider
        value={createAuthContextValue({ status: 'authenticated', token: 'token-1', user })}
      >
        <MemoryRouter initialEntries={['/employer/offers']}>
          <Routes>
            <Route element={<RequireAuth />}>
              <Route path="/employer" element={<RequireRole roles={['EMPLOYER']} />}>
                <Route path="offers" element={<p>Panel del empleador</p>} />
              </Route>
            </Route>
            <Route path="/offers" element={<p>Ofertas públicas</p>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    )

    expect(await screen.findByText('Ofertas públicas')).toBeTruthy()
    expect(screen.queryByText('Panel del empleador')).toBeNull()
  })
})
