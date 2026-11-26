import { Link, useLocation } from 'react-router-dom'
import { PlaceholderPage } from '../components/PlaceholderPage'

export function NotFoundPage() {
  const location = useLocation()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-12 sm:px-6">
      <div className="w-full">
        <PlaceholderPage
          eyebrow="404"
          title="Página no encontrada"
          description="La ruta solicitada no existe en esta aplicación."
          detail={location.pathname}
        />

        <Link
          to="/offers"
          className="mt-6 inline-flex rounded-lg border border-accent px-4 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/5"
        >
          Ir a las ofertas
        </Link>
      </div>
    </main>
  )
}
