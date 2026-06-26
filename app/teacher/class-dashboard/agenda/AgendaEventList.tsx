"use client"

import { useActionState, useState, useEffect, useRef } from "react"
import { deleteEvent } from "./actions"
import { Trash2, Calendar } from "lucide-react"
import { parseLocalDate } from "@/lib/date"
import DateBadge from "./DateBadge"
import { useToast } from "@/components/Toast"

interface AgendaEvent {
  id: string
  title: string
  description: string | null
  event_date: string
}

function DeleteEventButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => deleteEvent(formData),
    undefined,
  )
  const { show } = useToast()
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (state?.error) {
        show(state.error, "error")
      } else {
        show("Evento eliminado", "success")
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
      aria-label="Eliminar evento"
      className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-500 active:scale-90 dark:text-zinc-500 dark:hover:bg-red-950 dark:hover:text-red-400"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  )
}

export default function AgendaEventList({ events }: { events: AgendaEvent[] }) {
  const now = new Date()
  const today = now.toISOString().split("T")[0]

  const upcoming = events
    .filter((e) => e.event_date >= today)
    .sort((a, b) => a.event_date.localeCompare(b.event_date))

  const past = events
    .filter((e) => e.event_date < today)
    .sort((a, b) => b.event_date.localeCompare(a.event_date))

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            <Calendar className="h-4 w-4" />
          </span>
          Próximos eventos
        </h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No hay eventos próximos</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((event, i) => (
              <div
                key={event.id}
                className="card card-hover flex animate-fade-in-up items-start gap-3 p-3"
                style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
              >
                <DateBadge dateStr={event.event_date} size="sm" />
                <div className="flex-1">
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">{event.title}</p>
                  {event.description && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{event.description}</p>
                  )}
                </div>
                <DeleteEventButton id={event.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold text-zinc-400 dark:text-zinc-500">Eventos pasados</h3>
          <div className="space-y-1">
            {past.slice(0, 10).map((event, i) => (
              <div
                key={event.id}
                className="flex animate-fade-in items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 dark:text-zinc-500"
                style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>{parseLocalDate(event.event_date).toLocaleDateString("es-ES")}</span>
                <span>{event.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
