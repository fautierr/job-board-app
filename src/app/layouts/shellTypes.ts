export interface ShellLink {
  to: string
  label: string
  end?: boolean
  emphasis?: boolean
  /** Rutas exactas que activan el enlace, además de `to`. Admite segmentos `:param`. */
  activePaths?: readonly string[]
}

export interface ShellButton {
  label: string
  onClick: () => void
}

export type ShellAction = ShellLink | ShellButton

export interface AppShellProps {
  navItems: readonly ShellLink[]
  actions?: readonly ShellAction[]
  userLabel?: string | null
}
