"use client"

export default function TeacherError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6">
      <div className="text-5xl">⚠️</div>
      <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Algo salió mal</h1>
      <p className="max-w-sm text-center text-sm text-zinc-500 dark:text-zinc-400">{error.message}</p>
      <button onClick={reset} className="btn-primary">
        Intentar de nuevo
      </button>
    </div>
  )
}
