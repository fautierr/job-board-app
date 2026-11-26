import { Link, Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-panel sm:p-8">
        <Link
          to="/offers"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          Volver a las ofertas
        </Link>

        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
