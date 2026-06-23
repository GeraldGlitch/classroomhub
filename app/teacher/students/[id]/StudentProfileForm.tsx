"use client"

import { useActionState, useState } from "react"
import { updateStudent } from "../actions"
import { Plus, X } from "lucide-react"

interface Student {
  id: string
  name: string
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
        <label className="block text-sm font-medium text-zinc-700">Nombre</label>
        <input
          name="name"
          required
          defaultValue={student.name}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Campos personalizados</label>
        <div className="mt-1 space-y-2">
          {fields.map((field, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={field.key}
                onChange={(e) => updateField(i, e.target.value, field.value)}
                className="block w-2/5 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                value={field.value}
                onChange={(e) => updateField(i, field.key, e.target.value)}
                className="block flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button type="button" onClick={() => removeField(i)} className="text-zinc-400 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Nuevo campo"
              className="block w-2/5 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Valor"
              className="block flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button type="button" onClick={addField} className="rounded-lg bg-zinc-100 px-3 py-2 text-zinc-600 hover:bg-zinc-200">
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
