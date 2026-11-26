import type { ReactNode } from 'react'

export function FormMessage({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs leading-5 text-danger"
    >
      {children}
    </div>
  )
}
