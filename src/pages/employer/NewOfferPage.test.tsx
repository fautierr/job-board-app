import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../../api/http'
import { AuthContext } from '../../auth/AuthContext'
import type { PublicUser } from '../../auth/types'
import { ToastProvider } from '../../components/toast/ToastProvider'
import { ToastViewport } from '../../components/toast/ToastViewport'
import { createOffer } from '../../employer/employerOfferApi'
import { createAuthContextValue } from '../../test/authStub'
import { createEmployerOffer } from '../../test/fixtures'
import { NewOfferPage } from './NewOfferPage'

vi.mock('../../employer/employerOfferApi', () => ({
  createOffer: vi.fn(),
}))

const employer: PublicUser = {
  id: 'user-1',
  email: 'employer@example.com',
  role: 'EMPLOYER',
}

function renderNewOfferPage() {
  render(
    <MemoryRouter initialEntries={['/employer/offers/new']}>
      <ToastProvider>
        <AuthContext.Provider
          value={createAuthContextValue({
            status: 'authenticated',
            token: 'token-1',
            user: employer,
          })}
        >
          <Routes>
            <Route path="/employer/offers/new" element={<NewOfferPage />} />
            <Route path="/employer/offers" element={<p>Listado de ofertas</p>} />
          </Routes>
          <ToastViewport />
        </AuthContext.Provider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

function fillValidForm() {
  fireEvent.change(screen.getByLabelText('Título'), {
    target: { value: 'Desarrollador React' },
  })
  fireEvent.change(screen.getByLabelText('Descripción'), {
    target: { value: 'Trabajarás con React y TypeScript.' },
  })
  fireEvent.change(screen.getByLabelText('Categoría'), {
    target: { value: 'TECHNOLOGY_SYSTEMS' },
  })
  fireEvent.change(screen.getByLabelText('Experiencia'), {
    target: { value: 'JUNIOR' },
  })
  fireEvent.change(screen.getByLabelText('Modalidad'), {
    target: { value: 'REMOTE' },
  })
  fireEvent.change(screen.getByLabelText('Jornada'), {
    target: { value: 'FULL_TIME' },
  })
  fireEvent.change(screen.getByLabelText('Tipo de contrato'), {
    target: { value: 'EMPLOYMENT' },
  })
}

describe('NewOfferPage', () => {
  beforeEach(() => {
    vi.mocked(createOffer).mockResolvedValue(createEmployerOffer())
  })

  it('muestra errores y no crea la oferta con el formulario vacío', async () => {
    renderNewOfferPage()

    fireEvent.click(screen.getByRole('button', { name: 'Crear oferta' }))

    expect(await screen.findByText('Ingresá el título de la oferta.')).toBeTruthy()
    expect(screen.getByText('Ingresá la descripción de la oferta.')).toBeTruthy()
    expect(screen.getByText('Seleccioná una categoría.')).toBeTruthy()
    expect(createOffer).not.toHaveBeenCalled()
  })

  it('crea la oferta con el payload válido y vuelve al listado', async () => {
    renderNewOfferPage()
    fillValidForm()

    fireEvent.click(screen.getByRole('button', { name: 'Crear oferta' }))

    expect(await screen.findByText('Listado de ofertas')).toBeTruthy()
    expect(createOffer).toHaveBeenCalledWith('token-1', {
      title: 'Desarrollador React',
      description: 'Trabajarás con React y TypeScript.',
      category: 'TECHNOLOGY_SYSTEMS',
      seniority: 'JUNIOR',
      workMode: 'REMOTE',
      workday: 'FULL_TIME',
      contractType: 'EMPLOYMENT',
    })
  })

  it('muestra el error de la API y conserva el formulario', async () => {
    vi.mocked(createOffer).mockRejectedValue(
      new ApiError(0, 'NETWORK_ERROR', 'No se pudo conectar con el servidor.'),
    )
    renderNewOfferPage()
    fillValidForm()

    fireEvent.click(screen.getByRole('button', { name: 'Crear oferta' }))

    const messages = await screen.findAllByText(
      'No se pudo conectar con el servidor. Intentá nuevamente.',
    )
    expect(messages.length).toBeGreaterThan(0)
    expect(screen.getByDisplayValue('Desarrollador React')).toBeTruthy()
    expect(screen.queryByText('Listado de ofertas')).toBeNull()
  })
})
