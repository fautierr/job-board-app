import { offerStatusLabels } from '../../employer/offerStatus'
import type { OfferStatus } from '../../offers/types'

const statusClasses: Record<OfferStatus, string> = {
  PUBLISHED: 'border-accent/25 bg-accent/10 text-accent',
  PAUSED: 'border-line bg-line/25 text-muted',
  CLOSED: 'border-danger/25 bg-danger/10 text-danger',
}

export function OfferStatusBadge({ status }: { status: OfferStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusClasses[status]}`}
    >
      {offerStatusLabels[status]}
    </span>
  )
}
