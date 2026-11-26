function SkeletonLine({ className }: { className: string }) {
  return <span className={`block rounded bg-line/40 ${className}`} />
}

export function OfferDetailSkeleton() {
  return (
    <div className="min-h-[520px] space-y-4" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Cargando oferta</span>

      <div aria-hidden="true" className="space-y-4">
        <section className="rounded-xl border border-line bg-surface p-5 shadow-panel sm:p-6">
          <div className="flex items-start gap-3">
            <span className="h-10 w-10 shrink-0 rounded-lg bg-line/40" />
            <div className="min-w-0 flex-1 space-y-2.5">
              <SkeletonLine className="h-4 w-24" />
              <SkeletonLine className="h-7 w-3/4" />
              <SkeletonLine className="h-7 w-1/2" />
              <SkeletonLine className="h-4 w-32" />
            </div>
          </div>

          <div className="mt-5 border-t border-line pt-4">
            <SkeletonLine className="h-4 w-40" />
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <SkeletonLine className="h-7 w-20" />
            <SkeletonLine className="h-7 w-24" />
            <SkeletonLine className="h-7 w-16" />
            <SkeletonLine className="h-7 w-24" />
          </div>
        </section>

        <section className="rounded-xl border border-line bg-surface p-5 shadow-panel sm:p-6">
          <SkeletonLine className="h-3 w-24" />

          <div className="mt-4 space-y-2.5">
            <SkeletonLine className="h-3.5 w-full" />
            <SkeletonLine className="h-3.5 w-11/12" />
            <SkeletonLine className="h-3.5 w-4/5" />
            <SkeletonLine className="h-3.5 w-2/3" />
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <SkeletonLine className="h-4 w-48" />
            <SkeletonLine className="h-11 w-full sm:w-[176px]" />
          </div>
        </section>
      </div>
    </div>
  )
}
