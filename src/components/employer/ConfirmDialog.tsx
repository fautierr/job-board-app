import { useEffect, useId, useRef } from 'react'
import type { MouseEvent } from 'react'
import { createPortal } from 'react-dom'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const onCancelRef = useRef(onCancel)
  onCancelRef.current = onCancel

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement
    cancelRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancelRef.current()
        return
      }

      if (event.key !== 'Tab') return

      const buttons = [cancelRef.current, confirmRef.current].filter(
        (button): button is HTMLButtonElement => button !== null,
      )
      if (buttons.length === 0) return

      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [open])

  if (!open) return null

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !busy) onCancel()
  }

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink/30 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md rounded-xl border border-line bg-surface p-5 shadow-panel sm:p-6"
      >
        <h2 id={titleId} className="text-base font-semibold tracking-tight text-ink">
          {title}
        </h2>
        <p id={descriptionId} className="mt-2 text-xs leading-6 text-muted">
          {description}
        </p>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="rounded-lg border border-line px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-accent disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            ref={confirmRef}
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="rounded-lg bg-danger px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Cerrando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
