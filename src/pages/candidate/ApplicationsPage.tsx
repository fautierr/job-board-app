import { Link, useNavigate } from 'react-router-dom'
import { CandidateApplicationCard } from '../../components/applications/CandidateApplicationCard'
import { OfferStateNotice } from '../../components/offers/OfferStateNotice'
import { useApplicationOffers } from '../../applications/useApplicationOffers'
import { useCandidateApplications } from '../../applications/useCandidateApplications'

function ApplicationsSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="space-y-3">
      <span className="sr-only">Cargando postulaciones</span>
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          aria-hidden="true"
          className="h-[132px] rounded-xl border border-line bg-surface p-5 shadow-panel"
        >
          <div className="h-4 w-2/5 rounded bg-line/40" />
          <div className="mt-3 h-3 w-1/4 rounded bg-line/40" />
          <div className="mt-6 h-3 w-3/5 rounded bg-line/30" />
        </div>
      ))}
    </div>
  )
}

export function CandidateApplicationsPage() {
  const navigate = useNavigate()
  const { applications, loading, error, refetch } = useCandidateApplications()
  const { entries, retryOffer } = useApplicationOffers(applications)

  const loadErrorDescription =
    error?.code === 'NETWORK_ERROR'
      ? 'No se pudo conectar con el servidor. Revisá tu conexión e intentá nuevamente.'
      : 'Ocurrió un error al obtener tus postulaciones. Intentá nuevamente.'

  return (
    <section>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
          Candidato
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Mis postulaciones
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Revisá las ofertas a las que te postulaste y los datos que enviaste.
        </p>
      </div>

      <div className="mt-7" aria-busy={loading}>
        {loading && <ApplicationsSkeleton />}

        {!loading && error && (
          <OfferStateNotice
            title="No se pudieron cargar tus postulaciones"
            description={loadErrorDescription}
            actionLabel="Reintentar"
            onAction={refetch}
          />
        )}

        {!loading && !error && applications.length === 0 && (
          <OfferStateNotice
            title="Todavía no te postulaste"
            description="Explorá las ofertas publicadas y enviá tu primera postulación."
            actionLabel="Explorar ofertas"
            onAction={() => navigate('/offers')}
          />
        )}

        {!loading && !error && applications.length > 0 && (
          <ul className="space-y-3">
            {applications.map((application) => (
              <CandidateApplicationCard
                key={application.id}
                application={application}
                offerEntry={entries[application.offerId]}
                onRetryOffer={retryOffer}
              />
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 text-xs text-muted">
        ¿Querés ver más oportunidades?{' '}
        <Link to="/offers" className="font-medium text-accent hover:underline">
          Explorar ofertas
        </Link>
      </p>
    </section>
  )
}
