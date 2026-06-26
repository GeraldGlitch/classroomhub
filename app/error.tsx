"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="text-6xl animate-pop-in">⚠️</div>
      <h1 className="animate-fade-in text-2xl font-bold text-zinc-800">Algo salió mal</h1>
      <p className="max-w-sm text-center text-sm text-zinc-500">{error.message}</p>
      <button
        onClick={reset}
        className="btn-primary"
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
