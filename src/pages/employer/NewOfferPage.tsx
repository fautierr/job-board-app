import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OfferForm } from '../../components/employer/OfferForm'
import { OfferFormCloseButton } from '../../components/employer/OfferFormCloseButton'
import {
  getOfferFieldErrors,
  getOfferFormErrorMessage,
} from '../../employer/offerFormValidation'
import { useEmployerOffers } from '../../employer/useEmployerOffers'
import type { OfferFieldErrors, OfferPayload } from '../../employer/types'

export function NewOfferPage() {
  const navigate = useNavigate()
  const { create, pendingId } = useEmployerOffers({ autoFetch: false })
  const [fieldErrors, setFieldErrors] = useState<OfferFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)

  const handleCancel = () => navigate('/employer/offers')

  const handleSubmit = async (payload: OfferPayload) => {
    setFieldErrors({})
    setFormError(null)

    const result = await create(payload)
    if (result.kind === 'error') {
      const nextFieldErrors = getOfferFieldErrors(result.error)
      setFieldErrors(nextFieldErrors)
      setFormError(
        result.error.code === 'VALIDATION_ERROR' &&
          Object.keys(nextFieldErrors).length > 0
          ? null
          : getOfferFormErrorMessage(
              result.error,
              'No se pudo crear la oferta.',
            ),
      )
      return
    }

    navigate('/employer/offers')
  }

  return (
    <section>
      <div className='flex justify-between'>
        <div>
          <p className='text-[11px] font-semibold uppercase tracking-[0.08em] text-accent'>
            Empleador
          </p>
          <h1 className='mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl'>
            Nueva oferta
          </h1>
          <p className='mt-2 text-sm leading-6 text-muted'>
            Completá los datos de la oferta. Se publicará automáticamente.
          </p>
        </div>
        <div>
          <OfferFormCloseButton onClick={handleCancel} />
        </div>
      </div>

      <div className='mt-7 rounded-xl border border-line bg-surface p-5 shadow-panel sm:p-6'>
        <OfferForm
          serverErrors={fieldErrors}
          formError={formError}
          isSubmitting={pendingId === 'new'}
          submitLabel='Crear oferta'
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </section>
  )
}
