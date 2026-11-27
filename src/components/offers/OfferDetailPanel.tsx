import type { ReactNode } from 'react'
import { ClockIcon } from '../icons'
import {
  categoryLabels,
  contractTypeLabels,
  seniorityLabels,
  workModeLabels,
  workdayLabels,
} from '../../offers/offerOptions'
import { companyInitials, formatRelativeDate } from '../../offers/offerFormat'
import type { PublicOffer } from '../../offers/types'

function DetailTag({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-line/20 px-2 py-1 text-[11px]">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </span>
  )
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
      {children}
    </h3>
  )
}

interface OfferDetailPanelProps {
  offer: PublicOffer
  isUpdating?: boolean
  applicationSection?: ReactNode
}

export function OfferDetailPanel({
  offer,
  isUpdating = false,
  applicationSection,
}: OfferDetailPanelProps) {
  return (
    <div className="space-y-4" aria-busy={isUpdating}>
      <section className="rounded-xl border border-line bg-surface p-5 shadow-panel sm:p-6">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-[11px] font-semibold text-accent"
          >
            {companyInitials(offer.companyName)}
          </span>

          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
              {categoryLabels[offer.category]}
            </span>

            <h2 className="mt-2.5 text-2xl font-semibold tracking-tight text-ink sm:text-[28px] sm:leading-tight">
              {offer.title}
            </h2>
            <p className="mt-1.5 text-sm font-medium text-ink/80">{offer.companyName}</p>
          </div>
        </div>

        <div className="mt-5 flex min-h-5 flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-3.5 w-3.5" />
            Publicada {formatRelativeDate(offer.createdAt).toLowerCase()}
          </span>
          <span role="status" aria-live="polite" className="text-[11px] text-muted">
            {isUpdating ? 'Actualizando…' : ''}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <DetailTag label="Modalidad" value={workModeLabels[offer.workMode]} />
          <DetailTag
            label="Experiencia"
            value={seniorityLabels[offer.seniority]}
          />
          <DetailTag label="Jornada" value={workdayLabels[offer.workday]} />
          <DetailTag
            label="Contrato"
            value={contractTypeLabels[offer.contractType]}
          />
        </div>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5 shadow-panel sm:p-6">
        <SectionHeading>Descripción</SectionHeading>
        <p className="mt-3 whitespace-pre-line text-[13px] leading-6 text-ink/75">
          {offer.description}
        </p>

        {applicationSection && (
          <div className="mt-5 border-t border-line pt-5">{applicationSection}</div>
        )}
      </section>
    </div>
  )
}
