import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmployerApplicationCard } from '../../components/applications/EmployerApplicationCard'
import { OfferStatusBadge } from '../../components/employer/OfferStatusBadge'
import { OfferStateNotice } from '../../components/offers/OfferStateNotice'
import { formatRelativeDate } from '../../offers/offerFormat'
import { categoryLabels } from '../../offers/offerOptions'
import { useOfferApplications } from '../../applications/useOfferApplications'
import { useEmployerOffers } from '../../employer/useEmployerOffers'

export function OfferApplicationsPage() {
  const navigate = useNavigate()
  const { offerId } = useParams<{ offerId: string }>()
  const {
    offers,
    loading: offersLoading,
    error: offersError,
    refetch: refetchOffers,
  } = useEmployerOffers()
  const {
    applications,
    loading,
    error,
    notFound,
    refetch,
  } = useOfferApplications(offerId)

  const offer = offers.find((item) => item.id === offerId)
  const missingOffer = !offerId || (!offersLoading && !offersError && !offer) || notFound

  const loadErrorDescription =
    error?.code === 'NETWORK_ERROR'
      ? 'No se pudo conectar con el servidor. Revisá tu conexión e intentá nuevamente.'
      : 'Ocurrió un error al obtener las postulaciones. Intentá nuevamente.'

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
            Empleador
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Postulaciones de la oferta
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Revisá las postulaciones recibidas, incluso si la oferta está pausada o cerrada.
          </p>
        </div>

        <Link
          to="/employer/offers"
          className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
        >
          Volver a mis ofertas
        </Link>
      </div>

      <div className="mt-7" aria-busy={offersLoading || loading}>
        {offersLoading && (
          <OfferStateNotice
            title="Cargando oferta"
            description="Estamos obteniendo los datos de tu oferta."
          />
        )}

        {!offersLoading && offersError && (
          <OfferStateNotice
            title="No se pudo cargar la oferta"
            description="No pudimos verificar tus ofertas. Reintentá para continuar."
            actionLabel="Reintentar"
            onAction={refetchOffers}
          />
        )}

        {!offersLoading && !offersError && missingOffer && (
          <OfferStateNotice
            title="No encontramos la oferta o no es tuya"
            description="Revisá el enlace o volvé al listado de tus ofertas."
            actionLabel="Volver a mis ofertas"
            onAction={() => navigate('/employer/offers')}
          />
        )}

        {!offersLoading && !offersError && !missingOffer && offer && (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface p-4 shadow-panel sm:p-5">
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-[15px] font-semibold tracking-tight text-ink">
                  {offer.title}
                </h2>
                <p className="mt-1 text-[11px] text-muted">
                  Actualizada {formatRelativeDate(offer.updatedAt).toLowerCase()} ·{' '}
                  {categoryLabels[offer.category]}
                </p>
              </div>
              <OfferStatusBadge status={offer.status} />
            </div>

            {loading && (
              <OfferStateNotice
                title="Cargando postulaciones"
                description="Estamos obteniendo las postulaciones recibidas."
              />
            )}

            {!loading && error && (
              <OfferStateNotice
                title="No se pudieron cargar las postulaciones"
                description={loadErrorDescription}
                actionLabel="Reintentar"
                onAction={refetch}
              />
            )}

            {!loading && !error && applications.length === 0 && (
              <OfferStateNotice
                title="Todavía no recibiste postulaciones"
                description="Cuando un candidato se postule a esta oferta, va a aparecer acá."
              />
            )}

            {!loading && !error && applications.length > 0 && (
              <ul className="space-y-3">
                {applications.map((application) => (
                  <EmployerApplicationCard key={application.id} application={application} />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  )
}
