import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '../../components/PlaceholderPage'

export function EditOfferPage() {
  const { offerId } = useParams<{ offerId: string }>()

  return (
    <PlaceholderPage
      eyebrow="Empleador"
      title="Editar oferta"
      description="Permitirá actualizar los campos editables de una oferta propia. El estado se gestionará por separado."
      detail={`/employer/offers/${offerId ?? 'sin-id'}/edit`}
    />
  )
}
