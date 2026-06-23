"use client"

import { useActionState } from "react"
import { Trash2 } from "lucide-react"
import { deleteResource } from "./actions"

export default function DeleteResourceButton({ id }: { id: string }) {
  const [, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => deleteResource(formData),
    undefined,
  )

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg p-2 text-zinc-400 dark:text-zinc-500 transition-colors hover:bg-red-50 dark:bg-red-950 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  )
}
