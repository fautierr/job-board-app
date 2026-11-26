import type { PaginationMetadata } from '../../offers/types'

interface OfferPaginationProps {
  pagination: PaginationMetadata
  onPageChange: (page: number) => void
}

export function OfferPagination({ pagination, onPageChange }: OfferPaginationProps) {
  if (pagination.totalPages === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-5">
      <p className="text-[11px] text-muted">
        Página {pagination.page} de {pagination.totalPages} · {pagination.total} ofertas
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!pagination.hasPrevious}
          onClick={() => onPageChange(pagination.page - 1)}
          className="rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-medium text-muted transition-colors hover:border-muted/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={!pagination.hasNext}
          onClick={() => onPageChange(pagination.page + 1)}
          className="rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-medium text-muted transition-colors hover:border-muted/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
