import { Link } from 'react-router-dom'
import { ClockIcon } from '../icons'
import { categoryLabels } from '../../offers/offerOptions'
import { formatDateTime } from '../../applications/applicationFormat'
import type { ApplicationDto, ApplicationOfferEntry } from '../../applications/types'

interface CandidateApplicationCardProps {
  application: ApplicationDto
  offerEntry: ApplicationOfferEntry | undefined
  onRetryOffer: (offerId: string) => void
}

export function CandidateApplicationCard({
  application,
  offerEntry,
  onRetryOffer,
}: CandidateApplicationCardProps) {
  const postedAt = formatDateTime(application.createdAt)

  return (
    <li className="rounded-xl border border-line bg-surface p-4 shadow-panel sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {offerEntry?.status === 'available' ? (
            <>
              <Link
                to={`/offers/${encodeURIComponent(application.offerId)}`}
                className="text-[15px] font-semibold tracking-tight text-ink transition-colors hover:text-accent"
              >
                {offerEntry.offer.title}
              </Link>
              <p className="mt-1 text-[13px] font-medium text-ink/80">
                {offerEntry.offer.companyName}
              </p>
              <p className="mt-1 text-[11px] text-muted">
                {categoryLabels[offerEntry.offer.category]}
              </p>
            </>
          ) : offerEntry?.status === 'unavailable' ? (
            <>
              <p className="text-[15px] font-semibold tracking-tight text-ink">
                Oferta no disponible públicamente
              </p>
              <p className="mt-1 text-[11px] text-muted">
                La oferta ya no está publicada, pero tu postulación se conserva.
              </p>
            </>
          ) : offerEntry?.status === 'error' ? (
            <>
              <p className="text-[15px] font-semibold tracking-tight text-ink">
                No se pudo cargar la oferta
              </p>
              <button
                type="button"
                onClick={() => onRetryOffer(application.offerId)}
                className="mt-2 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Reintentar
              </button>
            </>
          ) : (
            <p role="status" className="text-[13px] text-muted">
              Cargando oferta…
            </p>
          )}
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] text-muted">
          <ClockIcon className="h-3.5 w-3.5" />
          <time dateTime={application.createdAt} title={postedAt}>
            {postedAt}
          </time>
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-3 text-xs text-muted">
        <span>
          Nombre: <span className="font-medium text-ink">{application.candidateName}</span>
        </span>
        <span>
          Teléfono: <span className="font-medium text-ink">{application.phone}</span>
        </span>
      </div>
    </li>
  )
}
