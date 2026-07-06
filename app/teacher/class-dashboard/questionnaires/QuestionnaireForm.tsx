"use client"

import { useActionState } from "react"
import { createQuestionnaire, updateQuestionnaire } from "./actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Questionnaire {
  id: string
  title: string
  description: string | null
  instructions: string | null
  topic_group: string | null
  cooldown_minutes: number | null
}

export default function QuestionnaireForm({ questionnaire }: { questionnaire?: Questionnaire }) {
  const action = questionnaire ? updateQuestionnaire : createQuestionnaire
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => action(formData),
    undefined,
  )

  return (
    <div className="space-y-6">
      <Link
        href="/teacher/class-dashboard/questionnaires"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a cuestionarios
      </Link>

      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">?</span>
        </div>
        <h1 className="page-title">
          {questionnaire ? "Editar cuestionario" : "Nuevo cuestionario"}
        </h1>
      </div>

      <div className="card p-6">
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {state.error}
            </div>
          )}
          {questionnaire && <input type="hidden" name="id" value={questionnaire.id} />}

          <div>
            <label htmlFor="title" className="label-field">Título</label>
            <input
              id="title"
              name="title"
              required
              defaultValue={questionnaire?.title}
              className="input-field mt-1"
              placeholder="Ej: Examen de gramática"
            />
          </div>

          <div>
            <label htmlFor="description" className="label-field">Descripción</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={questionnaire?.description ?? ""}
              className="input-field mt-1"
              placeholder="Breve descripción del cuestionario"
            />
          </div>

          <div>
            <label htmlFor="instructions" className="label-field">Instrucciones</label>
            <textarea
              id="instructions"
              name="instructions"
              rows={3}
              defaultValue={questionnaire?.instructions ?? ""}
              className="input-field mt-1"
              placeholder="Instrucciones que verá el estudiante antes de comenzar"
            />
          </div>

          <div>
            <label htmlFor="topic_group" className="label-field">Grupo / Tema</label>
            <input
              id="topic_group"
              name="topic_group"
              defaultValue={questionnaire?.topic_group ?? ""}
              placeholder="Ej: Gramática, Vocabulario..."
              className="input-field mt-1"
            />
          </div>

          <div>
            <label htmlFor="cooldown_minutes" className="label-field">
              Tiempo de espera entre intentos (minutos)
            </label>
            <input
              id="cooldown_minutes"
              name="cooldown_minutes"
              type="number"
              min={0}
              defaultValue={questionnaire?.cooldown_minutes ?? 30}
              className="input-field mt-1 w-40"
            />
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              0 = sin espera
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={pending} className="btn-primary">
              {pending ? "Guardando..." : questionnaire ? "Guardar cambios" : "Crear cuestionario"}
            </button>
            <Link
              href="/teacher/class-dashboard/questionnaires"
              className="btn-secondary"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
