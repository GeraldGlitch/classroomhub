"use client"

import { useActionState, useState, useEffect, useRef } from "react"
import { Trash2 } from "lucide-react"
import { deleteResource } from "./actions"
import { useToast } from "@/components/Toast"

export default function DeleteResourceButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => deleteResource(formData),
    undefined,
  )
  const { show } = useToast()
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (state?.error) {
        show(state.error, "error")
      } else {
        show("Recurso eliminado", "success")
        setConfirming(false)
      }
    }
    wasPending.current = pending
  }, [pending, state, show])

  if (confirming) {
    return (
      <div className="flex animate-pop-in items-center gap-2 rounded-lg bg-red-50 px-2 py-1 dark:bg-red-950">
        <span className="text-xs font-semibold text-red-600 dark:text-red-400">¿Eliminar?</span>
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            disabled={pending}
            className="text-xs font-bold text-red-600 hover:text-red-800 active:scale-90 dark:text-red-400"
            aria-label="Confirmar eliminación"
          >
            {pending ? "..." : "Sí"}
          </button>
        </form>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs font-medium text-zinc-500 hover:text-zinc-700 active:scale-90 dark:text-zinc-400 dark:hover:text-zinc-300"
          aria-label="Cancelar eliminación"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-500 active:scale-90 dark:text-zinc-500 dark:hover:bg-red-950 dark:hover:text-red-400"
      aria-label="Eliminar recurso"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  )
}
