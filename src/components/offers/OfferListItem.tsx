import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BriefcaseIcon, ClockIcon } from '../icons'
import {
  contractTypeLabels,
  seniorityLabels,
  workModeLabels,
} from '../../offers/offerOptions'
import { companyInitials, formatRelativeDate } from '../../offers/offerFormat'
import type { PublicOffer } from '../../offers/types'

function MetaTag({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted">
      {icon}
      {children}
    </span>
  )
}

interface OfferListItemProps {
  offer: PublicOffer
  selected: boolean
  detailHref: string
}

export function OfferListItem({ offer, selected, detailHref }: OfferListItemProps) {
  return (
    <li>
      <Link
        to={detailHref}
        aria-current={selected ? 'true' : undefined}
        className={`relative block w-full border-b border-line px-4 py-4 text-left transition-colors last:border-b-0 sm:px-5 ${
          selected ? 'bg-accent/[0.07]' : 'hover:bg-line/25'
        }`}
      >
        {selected && (
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-[3px] bg-accent"
          />
        )}

        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[10px] font-semibold tracking-wide ${
              selected
                ? 'border-accent/25 bg-accent/10 text-accent'
                : 'border-line bg-line/20 text-muted'
            }`}
          >
            {companyInitials(offer.companyName)}
          </span>

          <div className="min-w-0 flex-1">
            <h3
              className={`truncate text-[15px] font-semibold tracking-tight ${
                selected ? 'text-accent' : 'text-ink'
              }`}
            >
              {offer.title}
            </h3>
            <p className="mt-1 truncate text-[13px] font-medium text-ink/80">
              {offer.companyName}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 pl-11">
          <MetaTag>{seniorityLabels[offer.seniority]}</MetaTag>
          <MetaTag icon={<BriefcaseIcon className="h-3 w-3" />}>
            {workModeLabels[offer.workMode]}
          </MetaTag>
          <MetaTag>{contractTypeLabels[offer.contractType]}</MetaTag>
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted">
            <ClockIcon className="h-3.5 w-3.5" />
            {formatRelativeDate(offer.createdAt)}
          </span>
        </div>
      </Link>
    </li>
  )
}
