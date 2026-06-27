"use client"

import { useActionState } from "react"
import { updateTeacherPrefix } from "./actions"

export default function PrefixForm({ currentPrefix }: { currentPrefix: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean; updated?: number } | undefined, formData: FormData) =>
      updateTeacherPrefix(formData),
    undefined,
  )

  return (
    <form action={formAction} className="mt-1 space-y-3">
      <div className="flex items-center gap-2">
        <input
          id="prefix"
          name="prefix"
          required
          minLength={3}
          maxLength={20}
          defaultValue={currentPrefix}
          className="block w-48 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm tracking-widest shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-indigo-800"
          placeholder="ej: english"
        />
        <button
          type="submit"
          disabled={pending}
          className="press-bouncy rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 transition-all duration-150 hover:bg-indigo-700 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
        >
          {pending ? "Guardando..." : "Guardar"}
        </button>
      </div>

      {state && "error" in state && state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      {state && "success" in state && state.success && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Prefijo actualizado
          {state.updated !== undefined && state.updated > 0 && (
            <> · {state.updated} código{state.updated !== 1 ? "s" : ""} de estudiante{state.updated !== 1 ? "s" : ""} actualizado{state.updated !== 1 ? "s" : ""}</>
          )}
        </p>
      )}
    </form>
  )
}
