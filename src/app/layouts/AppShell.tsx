import { Link, NavLink, Outlet, matchPath, useLocation } from 'react-router-dom'
import type { AppShellProps, ShellLink } from './shellTypes'

function linkClass(isActive: boolean, emphasis = false) {
  if (emphasis) {
    return 'rounded-lg border border-accent px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/5'
  }

  return `text-sm transition-colors ${
    isActive ? 'font-medium text-accent' : 'text-muted hover:text-ink'
  }`
}

export function AppShell({ navItems, actions = [], userLabel }: AppShellProps) {
  const { pathname } = useLocation()

  const isNavItemActive = (item: ShellLink) => {
    if (item.activePaths) {
      return item.activePaths.some((path) =>
        Boolean(matchPath({ path, end: true }, pathname)),
      )
    }

    return Boolean(
      matchPath({ path: item.to, end: item.end ?? false }, pathname),
    )
  }

  return (
    <div className='min-h-screen bg-bg'>
      <header className='sticky top-0 z-10 border-b border-line bg-surface'>
        <div className='mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'>
          <Link
            to='/offers'
            className='text-[15px] font-semibold tracking-tight text-ink'
          >
            <span className='text-accent font-extrabold text-lg'>
              Job Board
            </span>
          </Link>

          <nav
            aria-label='Navegación principal'
            className='hidden items-center gap-6 sm:flex'
          >
            {navItems.map((item) => {
              const active = isNavItemActive(item)

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={linkClass(active)}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className='flex items-center gap-3'>
            {userLabel && (
              <span className='hidden max-w-[180px] truncate text-xs text-muted lg:inline'>
                {userLabel}
              </span>
            )}

            {actions.map((action, index) => {
              if ('to' in action) {
                return (
                  <NavLink
                    key={`${action.to}-${index}`}
                    to={action.to}
                    end={action.end}
                    className={({ isActive }) =>
                      linkClass(isActive, action.emphasis)
                    }
                  >
                    {action.label}
                  </NavLink>
                )
              }

              return (
                <button
                  key={`action-${index}`}
                  type='button'
                  onClick={action.onClick}
                  className='text-sm text-muted transition-colors hover:text-ink'
                >
                  {action.label}
                </button>
              )
            })}
          </div>
        </div>

        {navItems.length > 0 && (
          <nav
            aria-label='Navegación principal móvil'
            className='flex gap-5 overflow-x-auto border-t border-line px-4 py-2.5 sm:hidden'
          >
            {navItems.map((item) => {
              const active = isNavItemActive(item)

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={`shrink-0 whitespace-nowrap text-xs transition-colors ${
                    active ? 'font-medium text-accent' : 'text-muted'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        )}
      </header>

      <main className='mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8'>
        <Outlet />
      </main>

      <footer className='border-t border-line'>
        <div className='mx-auto w-full max-w-[1240px] px-4 py-6 text-xs text-muted sm:px-6 lg:px-8'>
          Job Board
        </div>
      </footer>
    </div>
  )
}
