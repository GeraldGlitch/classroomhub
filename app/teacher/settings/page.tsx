import { Settings, Key } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="animate-fade-in text-2xl font-bold text-zinc-800 dark:text-zinc-100">Ajustes</h1>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Key className="mt-0.5 h-5 w-5 text-indigo-500" />
          <div>
            <h2 className="font-semibold text-zinc-700 dark:text-zinc-300">Códigos de acceso</h2>
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

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Settings className="mt-0.5 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
          <div>
            <h2 className="font-semibold text-zinc-700 dark:text-zinc-300">Próximamente</h2>
            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
              Más opciones de configuración estarán disponibles en próximas actualizaciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
