"use client"

import { useActionState } from "react"
import { updateStats } from "./actions"

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

  const correct = stats?.correct_answers ?? 0
  const total = stats?.total_answers ?? 0
  const completed = stats?.completed_questionnaires ?? 0

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="student_id" value={studentId} />

      {stats && (
        <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700">
          {correct} respuestas correctas de {total} preguntas en {completed} cuestionarios.
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-600">Correctas</label>
          <input
            name="correct_answers"
            type="number"
            defaultValue={correct}
            min={0}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600">Totales</label>
          <input
            name="total_answers"
            type="number"
            defaultValue={total}
            min={0}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600">Cuestionarios</label>
          <input
            name="completed_questionnaires"
            type="number"
            defaultValue={completed}
            min={0}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Actualizar estadísticas"}
      </button>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  )
}
