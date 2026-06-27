import { createClient } from "@/lib/supabase/server"
import { BookText, Plus, Pencil } from "lucide-react"
import Link from "next/link"
import DeleteReadingButton from "./DeleteReadingButton"

export default async function ReadingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: readings } = await supabase
    .from("readings")
    .select("id, title, text, topic_group, created_at, updated_at")
    .eq("teacher_id", user!.id)
    .order("topic_group", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  const list = readings ?? []

  const grouped = list.reduce<Record<string, typeof list>>((acc, r) => {
    const key = r.topic_group ?? "Sin grupo"
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header animate-fade-in-up">
          <div className="page-header-icon bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <BookText className="h-7 w-7" />
          </div>
          <h1 className="page-title">Lecturas</h1>
        </div>
        <Link
          href="/teacher/class-dashboard/readings/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nueva lectura
        </Link>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <BookText className="h-10 w-10" />
          </div>
          <h2 className="text-lg font-bold text-zinc-600 dark:text-zinc-400">No hay lecturas aún</h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Crea tu primera lectura para compartir con la clase
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([group, items]) => (
            <section key={group}>
              <h2 className="section-title mb-3">{group}</h2>
              <div className="space-y-3">
                {items.map((reading, i) => (
                  <div
                    key={reading.id}
                    className="card card-hover animate-fade-in-up p-4"
                    style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/teacher/class-dashboard/readings/${reading.id}/edit`}
                        className="flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 rounded-lg"
                      >
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{reading.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                          {reading.text}
                        </p>
                      </Link>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/teacher/class-dashboard/readings/${reading.id}/edit`}
                          aria-label="Editar lectura"
                          className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
                        >
                          <Pencil className="h-5 w-5" />
                        </Link>
                        <DeleteReadingButton id={reading.id} title={reading.title} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
