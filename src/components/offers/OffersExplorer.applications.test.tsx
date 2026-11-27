import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApplication, getMyApplications } from '../../applications/applicationApi'
import { AuthContext } from '../../auth/AuthContext'
import type { PublicUser } from '../../auth/types'
import { ToastProvider } from '../toast/ToastProvider'
import { ToastViewport } from '../toast/ToastViewport'
import { getOfferById, getOffers } from '../../offers/offerApi'
import { createAuthContextValue } from '../../test/authStub'
import { createApplication as createApplicationFixture, createPublicOffer } from '../../test/fixtures'
import { OffersExplorer } from './OffersExplorer'

vi.mock('../../offers/offerApi', () => ({
  getOffers: vi.fn(),
  getOfferById: vi.fn(),
}))

vi.mock('../../applications/applicationApi', () => ({
  getMyApplications: vi.fn(),
  createApplication: vi.fn(),
}))

const candidate: PublicUser = {
  id: 'user-1',
  email: 'candidate@example.com',
  role: 'CANDIDATE',
}

const offer = createPublicOffer()

function renderExplorer() {
  render(
    <MemoryRouter initialEntries={['/offers/offer-1']}>
      <ToastProvider>
        <AuthContext.Provider
          value={createAuthContextValue({
            status: 'authenticated',
            token: 'token-1',
            user: candidate,
          })}
        >
          <OffersExplorer offerId="offer-1" />
          <ToastViewport />
        </AuthContext.Provider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe('OffersExplorer: postulaciones', () => {
  beforeEach(() => {
    vi.mocked(getOffers).mockResolvedValue({
      offers: [offer],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
    })
    vi.mocked(getOfferById).mockResolvedValue(offer)
    vi.mocked(getMyApplications).mockResolvedValue([])
    vi.mocked(createApplication).mockResolvedValue(createApplicationFixture())
  })

  it('valida el formulario de postulación antes de enviar', async () => {
    renderExplorer()

    fireEvent.click(await screen.findByRole('button', { name: 'Postularme' }))
    fireEvent.click(screen.getByRole('button', { name: 'Enviar postulación' }))

    expect(await screen.findByText('Ingresá tu nombre.')).toBeTruthy()
    expect(screen.getByText('Ingresá tu teléfono.')).toBeTruthy()
    expect(createApplication).not.toHaveBeenCalled()
  })

  it('envía solo nombre y teléfono y actualiza el estado visual', async () => {
    renderExplorer()

    fireEvent.click(await screen.findByRole('button', { name: 'Postularme' }))
    fireEvent.change(screen.getByLabelText('Nombre y apellido'), {
      target: { value: 'María López' },
    })
    fireEvent.change(screen.getByLabelText('Teléfono'), {
      target: { value: '+5493415559999' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar postulación' }))

    expect(
      await screen.findByText('Ya registraste tu postulación a esta oferta.'),
    ).toBeTruthy()
    expect(createApplication).toHaveBeenCalledWith('token-1', 'offer-1', {
      candidateName: 'María López',
      phone: '+5493415559999',
    })

    const listado = screen.getByRole('region', { name: 'Listado de ofertas' })
    expect(within(listado).getByText('Ya postulado')).toBeTruthy()
  })
})
