"use client"

import { useActionState, useState, useTransition } from "react"
import { updateStudent, regenerateStudentCode } from "../actions"
import type { StudentActionState } from "../actions"
import { RefreshCw } from "lucide-react"

interface Student {
  id: string
  name: string
  access_code: string
  custom_fields: Record<string, string>
}

export default function StudentProfileForm({ student }: { student: Student }) {
  const [state, action, pending] = useActionState<StudentActionState, FormData>(updateStudent, {})

  const [code, setCode] = useState(student.access_code)
  const [regenPending, startRegen] = useTransition()

  function handleRegenerate() {
    startRegen(async () => {
      const fd = new FormData()
      fd.set("id", student.id)
      const result = await regenerateStudentCode(fd)
      if (result?.code) setCode(result.code)
    })
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={student.id} />

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nombre</label>
        <input
          name="name"
          required
          defaultValue={student.name}
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Código de acceso</label>
        <div className="mt-1 flex items-center gap-2">
          <input
            name="access_code"
            required
            minLength={3}
            maxLength={50}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="block flex-1 rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 font-mono text-sm tracking-widest shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
          />
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regenPending}
            className="press-bouncy flex items-center gap-1 rounded-xl border border-zinc-200 px-2.5 py-2 text-xs text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 active:scale-90 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
            title="Generar código aleatorio"
            aria-label="Generar código aleatorio"
          >
            <RefreshCw className={`h-5 w-5 ${regenPending ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Campos personalizados</label>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Los campos personalizados se gestionan desde la aplicación de escritorio.</p>
      </div>

      {state?.error && <p className="text-sm text-red-500 animate-fade-in">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600 animate-fade-in">&#10003; Guardado correctamente</p>}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  )
}
