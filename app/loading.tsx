export default function RootLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p className="animate-fade-in text-sm text-zinc-400 dark:text-zinc-500">Cargando...</p>
      </div>
    </div>
  )
}
