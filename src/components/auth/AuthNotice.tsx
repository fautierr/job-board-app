interface AuthNoticeProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function AuthNotice({ title, description, actionLabel, onAction }: AuthNoticeProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface p-6 text-center shadow-panel sm:p-8">
        <h1 className="text-lg font-semibold tracking-tight text-ink">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-6 rounded-lg bg-accent px-4 py-2 text-xs font-medium text-surface transition-colors hover:bg-accent/90"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </main>
  )
}
