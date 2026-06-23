import { createClient } from "@/lib/supabase/server"
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
      <h1 className="text-2xl font-bold text-zinc-800">Agenda</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <AgendaCalendar events={events ?? []} />
        </div>
        <AgendaEventList events={events ?? []} />
      </div>
    </div>
  )
}
