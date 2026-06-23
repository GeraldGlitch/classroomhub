import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BookOpen, Calendar, ArrowRight } from "lucide-react"
import { parseLocalDate } from "@/lib/date"

export default async function ClassDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: resources } = await supabase
    .from("resources")
    .select("id", { count: "exact", head: true })
    .eq("teacher_id", user!.id)

  const { data: upcoming } = await supabase
    .from("agenda_events")
    .select("id, title, event_date")
    .eq("teacher_id", user!.id)
    .gte("event_date", new Date().toISOString().split("T")[0])
    .order("event_date")
    .limit(5)

  const resourceCount = resources?.length ?? 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 dark:text-zinc-100">Panel de Clase</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/teacher/class-dashboard/resources"
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 dark:text-zinc-100">Recursos</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-400">{resourceCount} recursos</p>
            </div>
            <BookOpen className="h-8 w-8 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm font-medium text-indigo-600">
            Gestionar <ArrowRight className="h-3 w-3" />
          </div>
        </Link>

        <Link
          href="/teacher/class-dashboard/agenda"
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm transition-all hover:border-orange-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 dark:text-zinc-100">Agenda</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-400">
                {upcoming?.length ?? 0} próximos eventos
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm font-medium text-orange-600">
            Ver calendario <ArrowRight className="h-3 w-3" />
          </div>
        </Link>
      </div>

      {upcoming && upcoming.length > 0 && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-3 font-semibold text-zinc-700 dark:text-zinc-300 dark:text-zinc-300">Próximos eventos</h3>
          <div className="space-y-2">
            {upcoming.map((event) => (
              <div key={event.id} className="flex items-center gap-3 text-sm">
                <span className="rounded-md bg-indigo-100 dark:bg-indigo-950 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 dark:bg-indigo-950 dark:text-indigo-300">
                  {parseLocalDate(event.event_date).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span className="text-zinc-700 dark:text-zinc-300">{event.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
