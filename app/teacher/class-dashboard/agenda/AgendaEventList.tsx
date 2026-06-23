"use client"

import { useActionState } from "react"
import { deleteEvent } from "./actions"
import { Trash2, Calendar } from "lucide-react"

interface AgendaEvent {
  id: string
  title: string
  description: string | null
  event_date: string
}

function DeleteEventButton({ id }: { id: string }) {
  const [, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => deleteEvent(formData),
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
        <h3 className="mb-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Próximos eventos</h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No hay eventos próximos</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3"
              >
                <div className="flex-shrink-0 text-center">
                  <div className="text-xs font-semibold text-indigo-600">
                    {new Date(event.event_date).toLocaleDateString("es-ES", { weekday: "short" })}
                  </div>
                  <div className="text-lg font-bold text-zinc-700 dark:text-zinc-300">
                    {new Date(event.event_date).getDate()}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-zinc-800 dark:text-zinc-100">{event.title}</p>
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
          <h3 className="mb-3 text-sm font-semibold text-zinc-400 dark:text-zinc-500">Eventos pasados</h3>
          <div className="space-y-1">
            {past.slice(0, 10).map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 dark:text-zinc-500"
              >
                <Calendar className="h-3 w-3" />
                <span>{new Date(event.event_date).toLocaleDateString("es-ES")}</span>
                <span>{event.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
