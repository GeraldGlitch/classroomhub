"use client"

import { useActionState, useEffect, useRef } from "react"
import { updateStats } from "./actions"
import { CheckCircle2, ListTodo, BookCheck } from "lucide-react"
import { useToast } from "@/components/Toast"

interface Stats {
  correct_answers: number
  total_answers: number
  completed_questionnaires: number
}

export default function StatsForm({
  studentId,
  stats,
}: {
  studentId: string
  stats: Stats | null
}) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => updateStats(formData),
    undefined,
  )

  const { show } = useToast()
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (state?.error) show(state.error, "error")
      else show("Estadísticas actualizadas", "success")
    }
    wasPending.current = pending
  }, [pending, state, show])

  const correct = stats?.correct_answers ?? 0
  const total = stats?.total_answers ?? 0
  const completed = stats?.completed_questionnaires ?? 0
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="student_id" value={studentId} />

      {stats && (
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="grid grid-cols-3 gap-3">
            <div className="stat-tile">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Correctas
              </div>
              <p className="mt-1 text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{correct}</p>
            </div>
            <div className="stat-tile">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                <ListTodo className="h-4 w-4 text-indigo-500" />
                Totales
              </div>
              <p className="mt-1 text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{total}</p>
            </div>
            <div className="stat-tile">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                <BookCheck className="h-4 w-4 text-orange-500" />
                Cuestionarios
              </div>
              <p className="mt-1 text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{completed}</p>
            </div>
          </div>

          {total > 0 && (
            <div>
              <div className="mb-1 flex justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
                <span>Aciertos</span>
                <span>{percentage}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {correct} correctas de {total} preguntas en {completed} cuestionarios
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Correctas</label>
          <input
            name="correct_answers"
            type="number"
            defaultValue={correct}
            min={0}
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-indigo-800"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Totales</label>
          <input
            name="total_answers"
            type="number"
            defaultValue={total}
            min={0}
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-indigo-800"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Cuestionarios</label>
          <input
            name="completed_questionnaires"
            type="number"
            defaultValue={completed}
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
