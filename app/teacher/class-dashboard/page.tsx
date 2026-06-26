import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BookOpen, Calendar, ArrowRight, LayoutDashboard } from "lucide-react"
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
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <LayoutDashboard className="h-7 w-7" />
        </div>
        <h1 className="page-title">Panel de Clase</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/teacher/class-dashboard/resources"
          className="card card-hover group p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-zinc-800 dark:text-zinc-100">Recursos</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{resourceCount} recursos</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6 dark:bg-indigo-950 dark:text-indigo-400">
              <BookOpen className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            Gestionar <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </Link>

        <Link
          href="/teacher/class-dashboard/agenda"
          className="card card-hover group p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-zinc-800 dark:text-zinc-100">Agenda</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {upcoming?.length ?? 0} próximos eventos
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6 dark:bg-orange-950 dark:text-orange-400">
              <Calendar className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-orange-600 dark:text-orange-400">
            Ver calendario <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>

      {upcoming && upcoming.length > 0 && (
        <div className="card p-5 animate-fade-in-up">
          <h3 className="section-title mb-3">
            <span className="section-title-icon">
              <Calendar className="h-5 w-5" />
            </span>
            Próximos eventos
          </h3>
          <div className="space-y-2">
            {upcoming.map((event, i) => (
              <div
                key={event.id}
                className="group flex animate-fade-in-up items-center gap-3 rounded-xl px-2 py-1.5 text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
              >
                <span className="rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
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
