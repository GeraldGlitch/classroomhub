import { Settings, Key, BookText } from "lucide-react"
import { getTeacherData } from "./actions"
import PrefixForm from "./PrefixForm"

export default async function SettingsPage() {
  const teacher = await getTeacherData()

  return (
    <div className="space-y-6">
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <Settings className="h-7 w-7" />
        </div>
        <h1 className="page-title">Ajustes</h1>
      </div>

      <div className="card animate-fade-in-up p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500 dark:bg-indigo-950 dark:text-indigo-400">
            <Key className="h-6 w-6" />
          </div>
          <div className="w-full">
            <h2 className="font-bold text-zinc-700 dark:text-zinc-300">Prefijo de clase</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Este prefijo identifica tu clase. Los estudiantes lo usan junto a su código personal para iniciar sesión.
            </p>
            <div className="mt-2">
              <PrefixForm currentPrefix={teacher?.access_code ?? ""} />
            </div>
          </div>
        </div>
      </div>

      <div className="card animate-fade-in-up p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-500 dark:bg-emerald-950 dark:text-emerald-400">
            <BookText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-zinc-700 dark:text-zinc-300">Formato del código de acceso</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Los estudiantes deben ingresar su código completo como: <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{teacher?.access_code ?? "prefijo"}-código</span>
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><span className="font-medium text-zinc-700 dark:text-zinc-300">Prefijo:</span> identifica tu clase (<span className="font-mono text-zinc-700 dark:text-zinc-300">{teacher?.access_code ?? "ej: english"}</span>)</li>
              <li><span className="font-medium text-zinc-700 dark:text-zinc-300">Código del estudiante:</span> es el código único que generás para cada estudiante</li>
              <li><span className="font-medium text-zinc-700 dark:text-zinc-300">Ejemplo completo:</span> <span className="font-mono text-zinc-700 dark:text-zinc-300">{teacher?.access_code ?? "english"}-gerald123</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
