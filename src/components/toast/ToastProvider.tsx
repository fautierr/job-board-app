import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ToastContext } from './ToastContext'
import type { ToastContextValue, ToastOptions } from './ToastContext'
import type { ToastInput, ToastItem } from './toastTypes'

const DEFAULT_DURATION = 5000

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastsRef = useRef<ToastItem[]>([])
  const timersRef = useRef<Map<number, number>>(new Map())
  const nextIdRef = useRef(0)

  toastsRef.current = toasts

  const dismiss = useCallback((id: number) => {
    const timer = timersRef.current.get(id)

    if (timer !== undefined) {
      window.clearTimeout(timer)
      timersRef.current.delete(id)
    }

    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback(
    (input: ToastInput) => {
      const key = input.key ?? `${input.tone}:${input.message}`
      const id = nextIdRef.current + 1
      nextIdRef.current = id

      for (const toast of toastsRef.current) {
        if (toast.key !== key) continue

        const timer = timersRef.current.get(toast.id)
        if (timer !== undefined) window.clearTimeout(timer)
        timersRef.current.delete(toast.id)
      }

      setToasts((current) => [
        ...current.filter((toast) => toast.key !== key),
        { ...input, key, id },
      ])

      const timer = window.setTimeout(() => dismiss(id), input.duration ?? DEFAULT_DURATION)
      timersRef.current.set(id, timer)
    },
    [dismiss],
  )

  const success = useCallback(
    (message: string, options?: ToastOptions) => show({ ...options, message, tone: 'success' }),
    [show],
  )

  const error = useCallback(
    (message: string, options?: ToastOptions) => show({ ...options, message, tone: 'error' }),
    [show],
  )

  useEffect(() => {
    const timers = timersRef.current

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, show, success, error, dismiss }),
    [toasts, show, success, error, dismiss],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
