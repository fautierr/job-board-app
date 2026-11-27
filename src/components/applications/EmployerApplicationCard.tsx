import { ClockIcon } from '../icons'
import { formatDateTime } from '../../applications/applicationFormat'
import type { EmployerApplicationDto } from '../../applications/types'

interface EmployerApplicationCardProps {
  application: EmployerApplicationDto
}

export function EmployerApplicationCard({ application }: EmployerApplicationCardProps) {
  const postedAt = formatDateTime(application.createdAt)

  return (
    <li className="rounded-xl border border-line bg-surface p-4 shadow-panel sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold tracking-tight text-ink">
            {application.candidateName}
          </p>
          <p className="mt-1 text-[13px] text-muted">Teléfono: {application.phone}</p>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] text-muted">
          <ClockIcon className="h-3.5 w-3.5" />
          <time dateTime={application.createdAt} title={postedAt}>
            {postedAt}
          </time>
        </span>
      </div>
    </li>
  )
}
