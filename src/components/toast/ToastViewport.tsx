import { AlertIcon, CheckIcon, CloseIcon } from '../icons'
import { useToast } from './useToast'
import type { ToastItem } from './toastTypes'

interface ToastCardProps {
  toast: ToastItem
  onDismiss: () => void
}

function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const isSuccess = toast.tone === 'success'

  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      aria-live={isSuccess ? 'polite' : 'assertive'}
      aria-atomic="true"
      className="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-panel sm:w-[340px]"
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          isSuccess ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'
        }`}
      >
        {isSuccess ? (
          <CheckIcon className="h-3.5 w-3.5" />
        ) : (
          <AlertIcon className="h-3.5 w-3.5" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold leading-5 text-ink">{toast.message}</p>
        {toast.description && (
          <p className="mt-0.5 text-[11px] leading-5 text-muted">{toast.description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar notificación"
        className="-mr-1 -mt-1 rounded-md p-1 text-muted transition-colors hover:bg-line/40 hover:text-ink"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastViewport() {
  const { toasts, dismiss } = useToast()

  return (
    <div
      role="region"
      aria-label="Notificaciones"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  )
}
