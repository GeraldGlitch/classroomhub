"use client"

import { useActionState, useState } from "react"
import { updateStudent } from "../actions"
import { regenerateStudentCode } from "../actions"
import { Plus, X, RefreshCw } from "lucide-react"

interface Student {
  id: string
  name: string
  access_code: string
  custom_fields: Record<string, string>
}

export default function StudentProfileForm({ student }: { student: Student }) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => updateStudent(formData),
    undefined,
  )

  const initialFields = student.custom_fields ?? {}
  const [fields, setFields] = useState<{ key: string; value: string }[]>(
    Object.entries(initialFields).map(([key, value]) => ({ key, value })),
  )
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  const [code, setCode] = useState(student.access_code)

  const regenAction = async (_prev: { code?: string; error?: string } | null, _formData: FormData) => {
    const fd = new FormData()
    fd.set("id", student.id)
    const result = await regenerateStudentCode(fd)
    if (result?.code) setCode(result.code)
    return result ?? null
  }
  const [, regenFormAction, regenPending] = useActionState(regenAction, null)

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
            maxLength={20}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="block flex-1 rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 font-mono text-sm tracking-widest shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
          />
          <form action={regenFormAction} className="inline">
            <button
              type="submit"
              disabled={regenPending}
              className="flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-800 px-2 py-2 text-xs text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 disabled:opacity-50"
              title="Generar código aleatorio"
              aria-label="Generar código aleatorio"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${regenPending ? "animate-spin" : ""}`} />
            </button>
          </form>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Campos personalizados</label>
        <div className="mt-1 space-y-2">
          {fields.map((field, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={field.key}
                onChange={(e) => updateField(i, e.target.value, field.value)}
                className="block w-2/5 rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
              />
              <input
                value={field.value}
                onChange={(e) => updateField(i, field.key, e.target.value)}
                className="block flex-1 rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
              />
              <button type="button" onClick={() => removeField(i)} aria-label="Eliminar campo" className="text-zinc-400 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Nuevo campo"
              className="block w-2/5 rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
            />
            <input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Valor"
              className="block flex-1 rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
            />
            <button type="button" onClick={addField} aria-label="Añadir campo" className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <input type="hidden" name="custom_fields" value={JSON.stringify(Object.fromEntries(fields.map((f) => [f.key, f.value])))} />
      </div>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  )
}
