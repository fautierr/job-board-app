import { useParams } from 'react-router-dom'
import { OffersExplorer } from '../components/offers/OffersExplorer'

export function OffersPage() {
  const { offerId } = useParams<{ offerId: string }>()

  return <OffersExplorer offerId={offerId} />
}
