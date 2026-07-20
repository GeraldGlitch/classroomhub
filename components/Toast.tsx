"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { CheckCircle2, AlertCircle, X } from "lucide-react"

type ToastType = "success" | "error"
interface Toast {
  id: number
  message: string
  type: ToastType
}

const ToastContext = createContext<{ show: (msg: string, type?: ToastType) => void } | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) return { show: () => {} }
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex animate-slide-in-right items-center gap-2.5 rounded-xl border-2 px-4 py-3 shadow-lg ${
              t.type === "success"
                ? "border-green-400 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-950 dark:text-green-400"
                : "border-red-400 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-950 dark:text-red-400"
            }`}
          >
            <span
              key={t.type}
              className="inline-flex animate-pop-in"
            >
              {t.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
            </span>
            <span className="text-sm font-semibold">{t.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="ml-2 text-zinc-400 transition-colors hover:text-zinc-600 active:scale-90 dark:hover:text-zinc-300"
              aria-label="Cerrar notificación"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
