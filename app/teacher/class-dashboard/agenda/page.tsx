import { createClient } from "@/lib/supabase/server"
import { Calendar } from "lucide-react"
import AgendaCalendar from "./AgendaCalendar"
import AgendaEventList from "./AgendaEventList"

export default async function AgendaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: events } = await supabase
    .from("agenda_events")
    .select("*")
    .eq("teacher_id", user!.id)
    .order("event_date", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
          <Calendar className="h-7 w-7" />
        </div>
        <h1 className="page-title">Agenda</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-4">
          <AgendaCalendar events={events ?? []} />
        </div>
        <AgendaEventList events={events ?? []} />
      </div>
    </div>
  )
}
