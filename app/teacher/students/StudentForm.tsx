"use client"

import { useActionState, useState } from "react"
import { createStudent, updateStudent } from "./actions"
import { Plus, X, RefreshCw } from "lucide-react"

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
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => action(formData),
    undefined,
  )

  const [code, setCode] = useState(student?.access_code ?? randomCode())

  const initialFields = student?.custom_fields ?? {}
  const [fields, setFields] = useState<{ key: string; value: string }[]>(
    Object.entries(initialFields).map(([key, value]) => ({ key, value })),
  )
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  function addField() {
    if (!newKey) return
    setFields([...fields, { key: newKey, value: newValue }])
    setNewKey("")
    setNewValue("")
  }

  function removeField(i: number) {
    setFields(fields.filter((_, idx) => idx !== i))
  }

  function updateField(i: number, key: string, value: string) {
    setFields(fields.map((f, idx) => (idx === i ? { key, value } : f)))
  }

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
            maxLength={20}
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
            Código único para que el estudiante inicie sesión. Podés editarlo o usar el auto-generado.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Campos personalizados</label>
        <div className="mt-1 space-y-2">
          {fields.map((field, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={field.key}
                onChange={(e) => updateField(i, e.target.value, field.value)}
                placeholder="Nombre del campo"
                className="block w-1/3 rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                value={field.value}
                onChange={(e) => updateField(i, field.key, e.target.value)}
                placeholder="Valor"
                className="block flex-1 rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button type="button" onClick={() => removeField(i)} className="press-bouncy text-zinc-400 hover:text-red-500 active:scale-90">
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Campo (ej: Edad)"
              className="block w-1/3 rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Valor"
              className="block flex-1 rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button type="button" onClick={addField} className="press-bouncy rounded-xl bg-zinc-100 dark:bg-zinc-800 px-3 py-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 active:scale-90">
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
        <input type="hidden" name="custom_fields" value={JSON.stringify(Object.fromEntries(fields.map((f) => [f.key, f.value])))} />
      </div>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

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
