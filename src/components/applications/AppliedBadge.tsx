import { CheckIcon } from '../icons'

export function AppliedBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
      <CheckIcon className="h-3 w-3" />
      Ya postulado
    </span>
  )
}
