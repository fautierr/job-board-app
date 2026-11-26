interface PlaceholderPageProps {
  eyebrow: string
  title: string
  description: string
  detail?: string
}

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  detail,
}: PlaceholderPageProps) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>

      {detail && (
        <div className="mt-6 rounded-xl border border-line bg-surface p-5 shadow-panel">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
            Ruta
          </p>
          <p className="mt-2 break-all font-mono text-xs text-ink">{detail}</p>
        </div>
      )}

      <p className="mt-6 text-xs text-muted">
        Vista preparada para una etapa posterior.
      </p>
    </section>
  )
}
