"use client"

import { useActionState } from "react"
import { selectStudent } from "@/lib/actions/auth"
import { User } from "lucide-react"

interface Student {
  id: string
  name: string
}

export default function StudentSelectForm({ students }: { students: Student[] }) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => selectStudent(formData),
    undefined,
  )

  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
        <p className="text-zinc-500">No hay estudiantes registrados aún.</p>
        <p className="mt-1 text-xs text-zinc-400">Consulta con tu profesor.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        {students.map((student) => (
          <form key={student.id} action={action}>
            <input type="hidden" name="studentId" value={student.id} />
            <input type="hidden" name="studentName" value={student.name} />
            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-left text-sm font-medium transition-colors hover:border-indigo-200 hover:bg-indigo-50 disabled:opacity-50"
            >
              <User className="h-5 w-5 text-indigo-500" />
              {student.name}
            </button>
          </form>
        ))}
      </div>
      {state?.error && (
        <p className="mt-3 text-sm text-red-500">{state.error}</p>
      )}
    </div>
  )
}
