import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Calendar } from "lucide-react"

export default async function StudentAgendaPage() {
  const cookieStore = await cookies()
  const teacherId = cookieStore.get("teacher_id")?.value
  const studentId = cookieStore.get("student_id")?.value
  if (!teacherId || !studentId) redirect("/login")

  const supabase = await createClient()
  const now = new Date()
  const today = now.toISOString().split("T")[0]

  const { data: upcoming } = await supabase
    .from("agenda_events")
    .select("*")
    .eq("teacher_id", teacherId)
    .gte("event_date", today)
    .order("event_date")

  const { data: past } = await supabase
    .from("agenda_events")
    .select("*")
    .eq("teacher_id", teacherId)
    .lt("event_date", today)
    .order("event_date", { ascending: false })
    .limit(20)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Agenda</h1>

      {(!upcoming || upcoming.length === 0) && (!past || past.length === 0) ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <Calendar className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No hay eventos en la agenda</p>
        </div>
      ) : (
        <>
          <div>
            <h2 className="mb-3 text-lg font-semibold text-zinc-700 dark:text-zinc-300">Próximos eventos</h2>
            {(!upcoming || upcoming.length === 0) ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">No hay eventos próximos</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex-shrink-0 rounded-lg bg-indigo-100 px-3 py-2 text-center dark:bg-indigo-950">
                      <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {new Date(event.event_date).toLocaleDateString("es-ES", { month: "short" })}
                      </div>
                      <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                        {new Date(event.event_date).getDate()}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-800 dark:text-zinc-100">{event.title}</h3>
                      {event.description && (
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {past && past.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-zinc-400 dark:text-zinc-500">Eventos pasados</h2>
              <div className="space-y-1">
                {past.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 dark:text-zinc-500">
                    <span className="text-xs">
                      {new Date(event.event_date).toLocaleDateString("es-ES")}
                    </span>
                    <span>{event.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
