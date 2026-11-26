import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BriefcaseIcon, ClockIcon } from '../icons'
import { allowedStatusTransitions, statusActionLabel } from '../../employer/offerStatus'
import {
  contractTypeLabels,
  seniorityLabels,
  workModeLabels,
} from '../../offers/offerOptions'
import { formatRelativeDate } from '../../offers/offerFormat'
import type { OfferStatus } from '../../offers/types'
import type { EmployerOffer } from '../../employer/types'
import { OfferStatusBadge } from './OfferStatusBadge'

interface EmployerOfferCardProps {
  offer: EmployerOffer
  pending: boolean
  onStatusAction: (offer: EmployerOffer, status: OfferStatus) => void
}

function MetaTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted">
      {children}
    </span>
  )
}

export function EmployerOfferCard({
  offer,
  pending,
  onStatusAction,
}: EmployerOfferCardProps) {
  const transitions = allowedStatusTransitions(offer.status)

  return (
    <li>
      <article
        aria-busy={pending}
        className="rounded-xl border border-line bg-surface p-4 shadow-panel sm:p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/employer/offers/${offer.id}/edit`}
              className="text-[15px] font-semibold tracking-tight text-ink transition-colors hover:text-accent"
            >
              {offer.title}
            </Link>
            <p className="mt-1 text-[11px] text-muted">
              Actualizada {formatRelativeDate(offer.updatedAt).toLowerCase()}
            </p>
          </div>

          <OfferStatusBadge status={offer.status} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <MetaTag>{seniorityLabels[offer.seniority]}</MetaTag>
          <MetaTag>
            <BriefcaseIcon className="h-3 w-3" />
            {workModeLabels[offer.workMode]}
          </MetaTag>
          <MetaTag>{contractTypeLabels[offer.contractType]}</MetaTag>
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted">
            <ClockIcon className="h-3.5 w-3.5" />
            Creada {formatRelativeDate(offer.createdAt).toLowerCase()}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <Link
            to={`/employer/offers/${offer.id}/edit`}
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Editar
          </Link>

          {transitions.map((status) => (
            <button
              key={status}
              type="button"
              disabled={pending}
              onClick={() => onStatusAction(offer, status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                status === 'CLOSED'
                  ? 'border border-danger/30 text-danger hover:bg-danger/5'
                  : 'border border-line text-muted hover:border-accent hover:text-accent'
              }`}
            >
              {statusActionLabel(status)}
            </button>
          ))}

          {offer.status === 'CLOSED' && (
            <span className="text-[11px] text-muted">
              Estado terminal: no admite cambios de estado.
            </span>
          )}
        </div>
      </article>
    </li>
  )
}
