interface OfferStateNoticeProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function OfferStateNotice({
  title,
  description,
  actionLabel,
  onAction,
}: OfferStateNoticeProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-line bg-surface p-5 text-center shadow-panel sm:p-6"
    >
      <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 text-xs leading-6 text-muted">{description}</p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-lg bg-accent px-4 py-2 text-xs font-medium text-surface transition-colors hover:bg-accent/90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
