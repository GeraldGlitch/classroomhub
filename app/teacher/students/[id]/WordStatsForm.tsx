"use client"

import { useActionState, useEffect, useRef } from "react"
import { updateWordStats } from "./wordStatsActions"
import { CheckCircle2, ListTodo } from "lucide-react"
import { useToast } from "@/components/Toast"

interface WordStats {
  mispronounced_count: number
  total_read_count: number
}

export default function WordStatsForm({
  studentId,
  stats,
}: {
  studentId: string
  stats: WordStats | null
}) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => updateWordStats(formData),
    undefined,
  )

  const { show } = useToast()
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (state?.error) show(state.error, "error")
      else show("Estadísticas de lectura actualizadas", "success")
    }
    wasPending.current = pending
  }, [pending, state, show])

  const erradas = stats?.mispronounced_count ?? 0
  const totales = stats?.total_read_count ?? 0
  const aciertos = totales - erradas
  const percentage = totales > 0 ? Math.round((aciertos / totales) * 100) : 0

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="student_id" value={studentId} />

      {stats && (
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="grid grid-cols-2 gap-3">
            <div className="stat-tile">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                <ListTodo className="h-4 w-4 text-indigo-500" />
                Totales
              </div>
              <p className="mt-1 text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{totales}</p>
            </div>
            <div className="stat-tile">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                <CheckCircle2 className="h-4 w-4 text-red-500" />
                Erradas
              </div>
              <p className="mt-1 text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{erradas}</p>
            </div>
          </div>

          {totales > 0 && (
            <div>
              <div className="mb-1 flex justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
                <span>Aciertos</span>
                <span>{percentage}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {aciertos} aciertos de {totales} palabras leídas
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Totales leídas</label>
          <input
            name="total_read_count"
            type="number"
            defaultValue={totales}
            min={0}
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-indigo-800"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Erradas</label>
          <input
            name="mispronounced_count"
            type="number"
            defaultValue={erradas}
            min={0}
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-indigo-800"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary"
      >
        {pending ? "Guardando..." : "Actualizar estadísticas"}
      </button>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  )
}
