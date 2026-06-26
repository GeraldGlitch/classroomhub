import { GraduationCap } from "lucide-react"

export default function RootLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 shadow-lg shadow-indigo-200/40 dark:bg-indigo-950 dark:shadow-indigo-900/30">
          <GraduationCap className="h-9 w-9 animate-bob text-indigo-600 dark:text-indigo-400" />
        </div>
        <p className="animate-fade-in text-sm font-medium text-zinc-400 dark:text-zinc-500">Cargando...</p>
      </div>
    </div>
  )
}
