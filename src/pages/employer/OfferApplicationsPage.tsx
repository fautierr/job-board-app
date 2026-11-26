import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '../../components/PlaceholderPage'

export function OfferApplicationsPage() {
  const { offerId } = useParams<{ offerId: string }>()

  return (
    <PlaceholderPage
      eyebrow="Empleador"
      title="Postulaciones de la oferta"
      description="Esta vista listará las postulaciones recibidas para una oferta propia, incluso si la oferta está pausada o cerrada."
      detail={`/employer/offers/${offerId ?? 'sin-id'}/applications`}
    />
  )
}
