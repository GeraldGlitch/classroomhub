"use client"

import { useActionState, useState } from "react"
import { Trash2 } from "lucide-react"
import { deleteStudent } from "./actions"

export default function DeleteStudentButton({ id }: { id: string; name?: string }) {
  const [confirming, setConfirming] = useState(false)
  const [, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => deleteStudent(formData),
    undefined,
  )

  if (confirming) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-2 py-1">
        <span className="text-xs text-red-600">¿Eliminar?</span>
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" disabled={pending} className="text-xs font-medium text-red-600 hover:text-red-800">
            {pending ? "..." : "Sí"}
          </button>
        </form>
        <button onClick={() => setConfirming(false)} className="text-xs text-zinc-500 hover:text-zinc-700">
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
