"use client"

import { useActionState, useState } from "react"
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react"
import { createRoleplay } from "./actions"

interface InitialLine {
  actor_name: string
  line_text: string
}

export default function RoleplayForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => createRoleplay(formData),
    undefined,
  )

  const [lines, setLines] = useState<InitialLine[]>([])

  function addLine() {
    setLines([...lines, { actor_name: "", line_text: "" }])
  }

  function removeLine(i: number) {
    setLines(lines.filter((_, idx) => idx !== i))
  }

  function updateLine(i: number, key: keyof InitialLine, value: string) {
    setLines(lines.map((l, idx) => (idx === i ? { ...l, [key]: value } : l)))
  }

  function moveLineUp(i: number) {
    if (i === 0) return
    const next = [...lines]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    setLines(next)
  }

  function moveLineDown(i: number) {
    if (i === lines.length - 1) return
    const next = [...lines]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    setLines(next)
  }

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="label-field">
            Título
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="Ej: En la cafetería"
            className="input-field mt-1"
          />
        </div>

        <div>
          <label htmlFor="description" className="label-field">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Resumen o instrucciones para los estudiantes"
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
            placeholder="Ej: Gramática, Vocabulario..."
            className="input-field mt-1"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Líneas del roleplay</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Añade los actores y sus líneas. Podés añadir más después.
            </p>
          </div>
          <button
            type="button"
            onClick={addLine}
            className="press-bouncy inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 active:scale-95 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 dark:hover:bg-purple-900"
          >
            <Plus className="h-4 w-4" />
            Añadir línea
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            Aún no hay líneas. Podés añadirlas ahora o después desde la página de edición.
          </div>
        ) : (
          <div className="space-y-2">
            {lines.map((line, i) => (
              <div
                key={i}
                className="card flex items-start gap-2 p-3 animate-fade-in-up"
              >
                <div className="flex flex-shrink-0 flex-col items-center gap-0.5 pt-1">
                  <button
                    type="button"
                    onClick={() => moveLineUp(i)}
                    disabled={i === 0}
                    aria-label="Mover arriba"
                    className="press-bouncy rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveLineDown(i)}
                    disabled={i === lines.length - 1}
                    aria-label="Mover abajo"
                    className="press-bouncy rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      Actor
                    </span>
                    <input
                      value={line.actor_name}
                      onChange={(e) => updateLine(i, "actor_name", e.target.value)}
                      placeholder="Nombre del actor"
                      className="input-field flex-1"
                    />
                  </div>
                  <textarea
                    value={line.line_text}
                    onChange={(e) => updateLine(i, "line_text", e.target.value)}
                    placeholder="Texto de la línea"
                    rows={2}
                    className="input-field"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(i)}
                  aria-label="Eliminar línea"
                  className="press-bouncy flex-shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-500 active:scale-90 dark:hover:bg-red-950 dark:hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="hidden"
          name="lines"
          value={JSON.stringify(lines)}
        />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Guardando..." : "Crear roleplay"}
        </button>
      </div>
    </form>
  )
}
