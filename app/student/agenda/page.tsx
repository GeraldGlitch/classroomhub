import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Calendar } from "lucide-react"
import { parseLocalDate } from "@/lib/date"
import DateBadge from "@/app/teacher/class-dashboard/agenda/DateBadge"

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
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
          <Calendar className="h-7 w-7" />
        </div>
        <h1 className="page-title">Agenda</h1>
      </div>

      {(!upcoming || upcoming.length === 0) && (!past || past.length === 0) ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Calendar className="h-10 w-10" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No hay eventos en la agenda</p>
        </div>
      ) : (
        <>
          <div>
            <h2 className="mb-3 flex items-center gap-2.5 text-lg font-bold text-zinc-700 dark:text-zinc-300">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                <Calendar className="h-5 w-5" />
              </span>
              Próximos eventos
            </h2>
            {(!upcoming || upcoming.length === 0) ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">No hay eventos próximos</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((event, i) => (
                  <div
                    key={event.id}
                    className="card card-hover flex animate-fade-in-up items-start gap-4 p-4"
                    style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
                  >
                    <DateBadge dateStr={event.event_date} size="md" />
                    <div>
                      <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{event.title}</h3>
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
              <h2 className="mb-3 text-base font-bold text-zinc-400 dark:text-zinc-500">Eventos pasados</h2>
              <div className="space-y-1">
                {past.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 dark:text-zinc-500">
                    <span className="text-xs">
                      {parseLocalDate(event.event_date).toLocaleDateString("es-ES")}
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
