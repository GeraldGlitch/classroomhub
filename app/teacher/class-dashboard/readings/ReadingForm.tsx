"use client"

import { useActionState } from "react"
import { createReading, updateReading } from "./actions"

interface Reading {
  id: string
  title: string
  text: string
  topic_group: string | null
}

export default function ReadingForm({ reading }: { reading?: Reading }) {
  const isEditing = !!reading
  const action = isEditing ? updateReading : createReading

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | undefined, formData: FormData) => action(formData),
    undefined,
  )

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </div>
      )}

      {state && "success" in state && state.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
          Lectura actualizada
        </div>
      )}

      {isEditing && <input type="hidden" name="id" value={reading!.id} />}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="label-field">
            Título
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={reading?.title ?? ""}
            placeholder="Ej: The Solar System"
            className="input-field mt-1"
          />
        </div>

        <div>
          <label htmlFor="topic_group" className="label-field">
            Grupo / Tema
          </label>
          <input
            id="topic_group"
            name="topic_group"
            defaultValue={reading?.topic_group ?? ""}
            placeholder="Ej: Ciencia, Historia..."
            className="input-field mt-1"
          />
        </div>

        <div>
          <label htmlFor="text" className="label-field">
            Texto
          </label>
          <textarea
            id="text"
            name="text"
            required
            defaultValue={reading?.text ?? ""}
            rows={16}
            placeholder="Párrafo o texto largo para que los estudiantes practiquen lectura..."
            className="input-field mt-1"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear lectura"}
        </button>
      </div>
    </form>
  )
}
