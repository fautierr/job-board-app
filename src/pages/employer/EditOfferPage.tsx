import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { OfferForm } from '../../components/employer/OfferForm'
import { OfferFormCloseButton } from '../../components/employer/OfferFormCloseButton'
import { OfferStatusBadge } from '../../components/employer/OfferStatusBadge'
import { OfferStateNotice } from '../../components/offers/OfferStateNotice'
import {
  getOfferFieldErrors,
  getOfferFormErrorMessage,
  toOfferFormValues,
} from '../../employer/offerFormValidation'
import { useEmployerOffers } from '../../employer/useEmployerOffers'
import type { OfferFieldErrors, OfferPayload } from '../../employer/types'

export function EditOfferPage() {
  const { offerId } = useParams<{ offerId: string }>()
  const navigate = useNavigate()
  const { offers, loading, error, pendingId, refetch, update } =
    useEmployerOffers()
  const [fieldErrors, setFieldErrors] = useState<OfferFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)

  const handleCancel = () => navigate('/employer/offers')

  useEffect(() => {
    setFieldErrors({})
    setFormError(null)
  }, [offerId])

  const handleSubmit = async (payload: OfferPayload) => {
    if (!offerId) return

    setFieldErrors({})
    setFormError(null)

    const result = await update(offerId, payload)
    if (result.kind === 'error') {
      const nextFieldErrors = getOfferFieldErrors(result.error)
      setFieldErrors(nextFieldErrors)
      setFormError(
        result.error.code === 'VALIDATION_ERROR' &&
          Object.keys(nextFieldErrors).length > 0
          ? null
          : getOfferFormErrorMessage(
              result.error,
              'No se pudo guardar la oferta.',
            ),
      )
      return
    }

    navigate('/employer/offers')
  }

  const offer = offers.find((item) => item.id === offerId)

  return (
    <section>
      <div className='flex justify-between'>
        <div>
          <p className='text-[11px] font-semibold uppercase tracking-[0.08em] text-accent'>
            Empleador
          </p>
          <h1 className='mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl'>
            Editar oferta
          </h1>
          <p className='mt-2 text-sm leading-6 text-muted'>
            Actualizá los datos editables. El estado se gestiona desde el
            listado.
          </p>
        </div>
        <div>
          <OfferFormCloseButton onClick={handleCancel} />
        </div>
      </div>

      <div className='mt-7' aria-busy={loading}>
        {loading && (
          <div
            role='status'
            aria-live='polite'
            aria-busy='true'
            className='rounded-xl border border-line bg-surface p-5 shadow-panel'
          >
            <span className='sr-only'>Cargando oferta</span>
            <div aria-hidden='true' className='space-y-3'>
              <div className='h-4 w-1/3 rounded bg-line/40' />
              <div className='h-10 w-full rounded bg-line/30' />
              <div className='h-24 w-full rounded bg-line/30' />
            </div>
          </div>
        )}

        {!loading && error && (
          <OfferStateNotice
            title='No se pudo cargar la oferta'
            description={getOfferFormErrorMessage(
              error,
              'No se pudo cargar la oferta.',
            )}
            actionLabel='Reintentar'
            onAction={refetch}
          />
        )}

        {!loading && !error && !offer && (
          <OfferStateNotice
            title='No encontramos esta oferta'
            description='Puede que no exista o que no sea tuya.'
            actionLabel='Volver a mis ofertas'
            onAction={() => navigate('/employer/offers')}
          />
        )}

        {!loading && !error && offer && (
          <>
            <div className='rounded-xl border border-line bg-surface p-5 shadow-panel sm:p-6'>
              <div className='mb-5 flex flex-wrap items-center gap-2'>
                <span className='text-xs text-muted'>Estado actual</span>
                <OfferStatusBadge status={offer.status} />
              </div>

              <OfferForm
                key={offer.id}
                initialValues={toOfferFormValues(offer)}
                serverErrors={fieldErrors}
                formError={formError}
                isSubmitting={pendingId === offer.id}
                submitLabel='Guardar cambios'
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
