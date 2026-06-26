import { Settings, Key } from "lucide-react"

export default function SettingsPage() {
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
          <div>
            <h2 className="font-bold text-zinc-700 dark:text-zinc-300">Códigos de acceso</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Cada estudiante tiene su propio código de acceso único. Puedes verlo y regenerarlo desde:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
              <li>La lista de estudiantes (copia el código junto al nombre)</li>
              <li>El perfil individual de cada estudiante (&quot;Nuevo&quot; para regenerar)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card animate-fade-in-up p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-zinc-700 dark:text-zinc-300">Próximamente</h2>
            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
              Más opciones de configuración estarán disponibles en próximas actualizaciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
