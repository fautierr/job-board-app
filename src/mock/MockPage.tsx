import { useState } from 'react'
import type { MockJob } from './mockData'
import { mockJobs } from './mockData'
import { JobDetailPanel, JobListItem, MockFilters, MockHeader } from './parts'

type MobileView = 'list' | 'detail'

export default function MockPage() {
  const [selectedId, setSelectedId] = useState(mockJobs[0].id)
  const [mobileView, setMobileView] = useState<MobileView>('list')

  const selectedJob = mockJobs.find((job) => job.id === selectedId) ?? mockJobs[0]

  const handleSelect = (job: MockJob) => {
    setSelectedId(job.id)
    setMobileView('detail')
  }

  return (
    <div className="min-h-screen bg-bg">
      <MockHeader />

      <main className="mx-auto w-full max-w-[1240px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div
          className={`mb-5 items-end justify-between gap-4 ${
            mobileView === 'detail' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
              Ofertas publicadas
            </h1>
            <p className="mt-1 text-xs text-muted sm:text-sm">
              Explorá las oportunidades disponibles y revisá los detalles antes de postularte.
            </p>
          </div>
          <p className="hidden shrink-0 text-xs text-muted sm:block">
            {mockJobs.length} ofertas publicadas
          </p>
        </div>

        <div
          id="mock-listado"
          className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-6"
        >
          <section
            aria-label="Listado de ofertas"
            className={`min-w-0 ${mobileView === 'detail' ? 'hidden md:block' : 'block'}`}
          >
            <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-panel md:h-[calc(100vh-188px)] md:min-h-[520px]">
              <MockFilters />
              <div className="min-h-0 flex-1 overflow-y-auto">
                <ul>
                  {mockJobs.map((job) => (
                    <JobListItem
                      key={job.id}
                      job={job}
                      selected={job.id === selectedId}
                      onSelect={handleSelect}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section
            aria-label="Detalle de la oferta"
            className={`min-w-0 ${mobileView === 'detail' ? 'block' : 'hidden md:block'}`}
          >
            <div className="md:sticky md:top-20 md:h-[calc(100vh-104px)] md:min-h-[520px] md:overflow-y-auto md:pr-1">
              <JobDetailPanel
                key={selectedJob.id}
                job={selectedJob}
                onBack={() => setMobileView('list')}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
