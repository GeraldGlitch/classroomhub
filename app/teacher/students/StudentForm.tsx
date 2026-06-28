"use client"

import { useActionState, useState } from "react"
import { createStudent, updateStudent } from "./actions"
import type { StudentActionState } from "./actions"
import { RefreshCw } from "lucide-react"

interface Student {
  id: string
  name: string
  access_code?: string
  custom_fields: Record<string, string>
}

function randomCode(): string {
  return Math.random().toString(36).substring(2, 8).toLowerCase()
}

export default function StudentForm({ student }: { student?: Student }) {
  const action = student ? updateStudent : createStudent
  const [state, formAction, pending] = useActionState<StudentActionState, FormData>(
    async (_prev: unknown, formData: FormData) => action(_prev, formData),
    {},
  )

  const [code, setCode] = useState(student?.access_code ?? randomCode())

  function regenerateLocalCode() {
    setCode(randomCode())
  }

  return (
    <form action={formAction} className="space-y-4">
      {student && <input type="hidden" name="id" value={student.id} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Nombre completo
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={student?.name}
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="access_code" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Código de acceso
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            id="access_code"
            name="access_code"
            required
            minLength={3}
            maxLength={50}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="block flex-1 rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 font-mono text-sm tracking-widest shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ej: ana2024"
          />
          <button
            type="button"
            onClick={regenerateLocalCode}
            className="press-bouncy flex items-center gap-1 rounded-xl border border-zinc-200 px-2.5 py-2 text-xs text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 active:scale-90 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
            title="Generar código aleatorio"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
        {student?.access_code && (
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Código actual. Podés cambiarlo o generar uno nuevo con el botón.
          </p>
        )}
        {!student && (
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Código para el estudiante. Se le antepondrá el prefijo de tu clase automáticamente.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Campos personalizados</label>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Los campos personalizados se gestionan desde la aplicación de escritorio.</p>
      </div>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">&#10003; Guardado correctamente</p>}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary"
      >
        {pending ? "Guardando..." : student ? "Guardar cambios" : "Crear estudiante"}
      </button>
    </form>
  )
}
