import type { ReactNode } from 'react'
import type { FilterOption, MockJob } from './mockData'
import {
  categoryLabels,
  contractTypeLabels,
  mockCategories,
  mockContractTypes,
  mockSeniorities,
  mockWorkdays,
  mockWorkModes,
  seniorityLabels,
  workModeLabels,
  workdayLabels,
} from './mockData'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  SearchIcon,
} from './icons'

function companyInitials(company: string) {
  return company
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

// Fecha de referencia fija para que las etiquetas del mock no cambien con el tiempo.
const MOCK_REFERENCE_DATE = new Date('2026-11-26T12:00:00.000Z')

function formatRelativeDate(isoDate: string) {
  const days = Math.round(
    (MOCK_REFERENCE_DATE.getTime() - new Date(isoDate).getTime()) / 86_400_000,
  )
  if (days <= 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  const weeks = Math.floor(days / 7)
  return weeks === 1 ? 'Hace 1 semana' : `Hace ${weeks} semanas`
}

export function MockHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#mock-listado"
          className="text-[15px] font-semibold tracking-tight text-ink"
        >
          jobboard<span className="text-accent">.</span>
        </a>

        <span className="hidden rounded-full border border-line bg-line/20 px-2 py-0.5 text-[10px] font-medium text-muted sm:inline">
          Vista candidato
        </span>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-6 sm:flex"
        >
          <span className="text-sm font-medium text-accent">Ofertas</span>
          <span className="text-sm text-muted">Mis postulaciones</span>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted md:inline">
            Iniciar sesión
          </span>
          <button
            type="button"
            className="rounded-lg border border-accent px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/5"
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </header>
  )
}

interface FilterSelectProps {
  id: string
  label: string
  options: readonly FilterOption[]
}

function FilterSelect({ id, label, options }: FilterSelectProps) {
  return (
    <div className="relative">
      <label htmlFor={`mock-${id}`} className="sr-only">
        {label}
      </label>
      <select
        id={`mock-${id}`}
        defaultValue=""
        className="w-full appearance-none rounded-lg border border-line bg-surface py-2 pl-2.5 pr-7 text-xs text-muted transition-colors hover:border-muted/40 focus:border-accent"
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
    </div>
  )
}

export function MockFilters() {
  return (
    <div className="shrink-0 border-b border-line p-3 sm:p-4">
      <label htmlFor="mock-search" className="sr-only">
        Buscar ofertas
      </label>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          id="mock-search"
          type="search"
          placeholder="Buscar por puesto, empresa o descripción"
          className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-[13px] text-ink placeholder:text-muted/70 transition-colors hover:border-muted/40 focus:border-accent"
        />
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2 xl:grid-cols-3">
        <FilterSelect id="categoria" label="Categoría" options={mockCategories} />
        <FilterSelect
          id="seniority"
          label="Experiencia"
          options={mockSeniorities}
        />
        <FilterSelect
          id="modalidad"
          label="Modalidad"
          options={mockWorkModes}
        />
        <FilterSelect id="jornada" label="Jornada" options={mockWorkdays} />
        <FilterSelect
          id="contrato"
          label="Contrato"
          options={mockContractTypes}
        />
      </div>
    </div>
  )
}

function MetaTag({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted">
      {icon}
      {children}
    </span>
  )
}

interface JobListItemProps {
  job: MockJob
  selected: boolean
  onSelect: (job: MockJob) => void
}

export function JobListItem({ job, selected, onSelect }: JobListItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(job)}
        aria-pressed={selected}
        className={`relative w-full border-b border-line px-4 py-4 text-left transition-colors last:border-b-0 sm:px-5 ${
          selected ? 'bg-accent/[0.07]' : 'hover:bg-line/25'
        }`}
      >
        {selected && (
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-[3px] bg-accent"
          />
        )}

        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[10px] font-semibold tracking-wide ${
              selected
                ? 'border-accent/25 bg-accent/10 text-accent'
                : 'border-line bg-line/20 text-muted'
            }`}
          >
            {companyInitials(job.companyName)}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`min-w-0 truncate text-[15px] font-semibold tracking-tight ${
                  selected ? 'text-accent' : 'text-ink'
                }`}
              >
                {job.title}
              </h3>

              {job.applied === 'aplicada' && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                  <CheckIcon className="h-3 w-3" />
                  Ya postulado
                </span>
              )}
            </div>

            <p className="mt-1 truncate text-[13px] font-medium text-ink/80">
              {job.companyName}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 pl-11">
          <MetaTag>{seniorityLabels[job.seniority]}</MetaTag>
          <MetaTag icon={<BriefcaseIcon className="h-3 w-3" />}>
            {workModeLabels[job.workMode]}
          </MetaTag>
          <MetaTag>{contractTypeLabels[job.contractType]}</MetaTag>
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted">
            <ClockIcon className="h-3.5 w-3.5" />
            {formatRelativeDate(job.createdAt)}
          </span>
        </div>
      </button>
    </li>
  )
}

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

interface JobDetailPanelProps {
  job: MockJob
  onBack: () => void
}

export function JobDetailPanel({ job, onBack }: JobDetailPanelProps) {
  const applied = job.applied === 'aplicada'

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-accent md:hidden"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Volver al listado
      </button>

      <div className="space-y-4" aria-live="polite">
        <section className="rounded-xl border border-line bg-surface p-5 shadow-panel sm:p-6">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-[11px] font-semibold text-accent"
            >
              {companyInitials(job.companyName)}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                  {categoryLabels[job.category]}
                </span>
                {applied && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-0.5 text-[10px] font-medium text-muted">
                    <CheckIcon className="h-3 w-3 text-accent" />
                    Ya postulado
                  </span>
                )}
              </div>

              <h2 className="mt-2.5 text-2xl font-semibold tracking-tight text-ink sm:text-[28px] sm:leading-tight">
                {job.title}
              </h2>
              <p className="mt-1.5 text-sm font-medium text-ink/80">
                {job.companyName}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center border-t border-line pt-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5" />
              Publicada {formatRelativeDate(job.createdAt).toLowerCase()}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <DetailTag label="Modalidad" value={workModeLabels[job.workMode]} />
            <DetailTag
              label="Experiencia"
              value={seniorityLabels[job.seniority]}
            />
            <DetailTag label="Jornada" value={workdayLabels[job.workday]} />
            <DetailTag
              label="Contrato"
              value={contractTypeLabels[job.contractType]}
            />
          </div>
        </section>

        <section className="rounded-xl border border-line bg-surface p-5 shadow-panel sm:p-6">
          <div>
            <SectionHeading>Descripción</SectionHeading>
            <p className="mt-3 text-[13px] leading-6 text-ink/75">
              {job.description}
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="hidden text-xs text-muted sm:block">
              {applied
                ? 'Ya registraste tu postulación a esta oferta.'
                : 'La postulación solicita nombre y teléfono.'}
            </p>
            <button
              type="button"
              disabled={applied}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-accent/40 sm:w-auto sm:min-w-[176px]"
            >
              {applied ? (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Ya postulado
                </>
              ) : (
                <>
                  Postularme
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
