import type { FormEvent } from 'react'
import { ChevronDownIcon, SearchIcon } from '../icons'
import { filterLabels, offerFilterKeys, optionsForFilter } from '../../offers/offerOptions'
import type { OfferFilterKey, OfferQuery } from '../../offers/types'

interface OfferFiltersProps {
  query: OfferQuery
  searchValue: string
  hasActiveFilters: boolean
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  onFilterChange: (key: OfferFilterKey, value: string) => void
  onClear: () => void
}

export function OfferFilters({
  query,
  searchValue,
  hasActiveFilters,
  onSearchChange,
  onSearchSubmit,
  onFilterChange,
  onClear,
}: OfferFiltersProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearchSubmit()
  }

  return (
    <div className="shrink-0 border-b border-line p-3 sm:p-4">
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="offers-search" className="sr-only">
          Buscar ofertas
        </label>
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          id="offers-search"
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          maxLength={120}
          placeholder="Buscar por puesto, empresa o descripción"
          className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-[13px] text-ink placeholder:text-muted/70 transition-colors hover:border-muted/40 focus:border-accent"
        />
      </form>

      <div className="mt-2.5 grid grid-cols-2 gap-2 xl:grid-cols-3">
        {offerFilterKeys.map((key) => (
          <div className="relative" key={key}>
            <label htmlFor={`offers-${key}`} className="sr-only">
              {filterLabels[key]}
            </label>
            <select
              id={`offers-${key}`}
              value={query[key] ?? ''}
              onChange={(event) => onFilterChange(key, event.target.value)}
              className="w-full appearance-none rounded-lg border border-line bg-surface py-2 pl-2.5 pr-7 text-xs text-muted transition-colors hover:border-muted/40 focus:border-accent"
            >
              <option value="">{filterLabels[key]}</option>
              {optionsForFilter(key).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          </div>
        ))}
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-2.5 text-[11px] font-medium text-accent transition-colors hover:underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
