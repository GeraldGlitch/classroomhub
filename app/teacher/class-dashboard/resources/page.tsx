import { createClient } from "@/lib/supabase/server"
import { BookOpen, ExternalLink, Plus, Pencil, Video, Globe } from "lucide-react"
import Link from "next/link"
import DeleteResourceButton from "./DeleteResourceButton"

function linkIcon(url: string) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return Video
  return Globe
}

export default async function ResourcesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("teacher_id", user!.id)
    .order("topic_group", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  const list = resources ?? []
  const grouped = list.reduce<Record<string, typeof list>>((acc, r) => {
    const key = r.topic_group ?? "Sin grupo"
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="animate-fade-in text-2xl font-bold text-zinc-800 dark:text-zinc-100">Recursos</h1>
        <Link
          href="/teacher/class-dashboard/resources/new"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo recurso
        </Link>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="flex animate-fade-in flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
          <BookOpen className="h-10 w-10 animate-bounce-subtle text-zinc-300" />
          <h2 className="font-semibold text-zinc-600 dark:text-zinc-400">No hay recursos aún</h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">Crea tu primer recurso para compartir con la clase</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([group, items]) => (
            <section key={group}>
              <h2 className="mb-3 text-lg font-semibold text-zinc-700 dark:text-zinc-300">{group}</h2>
              <div className="space-y-3">
                {items.map((resource, i) => (
                  <div
                    key={resource.id}
                    className="animate-fade-in-up rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                    style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-zinc-800 dark:text-zinc-100">{resource.title}</h3>
                        {resource.description && (
                          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{resource.description}</p>
                        )}
                        {resource.external_links && resource.external_links.length > 0 && (() => {
                          const link = resource.external_links[0]
                          const Icon = linkIcon(link.url)
                          return (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
                            >
                              <Icon className="h-3.5 w-3.5" />
                              <span>Abrir enlace</span>
                              <ExternalLink className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
                            </a>
                          )
                        })()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/teacher/class-dashboard/resources/${resource.id}/edit`}
                          aria-label="Editar recurso"
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteResourceButton id={resource.id} />
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
