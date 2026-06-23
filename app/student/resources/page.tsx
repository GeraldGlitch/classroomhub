import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BookOpen, ExternalLink } from "lucide-react"

export default async function StudentResourcesPage() {
  const cookieStore = await cookies()
  const teacherId = cookieStore.get("teacher_id")?.value
  const studentId = cookieStore.get("student_id")?.value
  if (!teacherId || !studentId) redirect("/login")

  const supabase = await createClient()
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("teacher_id", teacherId)
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
      <h1 className="text-2xl font-bold text-zinc-800">Recursos</h1>

      {Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <BookOpen className="h-10 w-10 text-zinc-300" />
          <p className="text-sm text-zinc-400">No hay recursos compartidos aún</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([group, items]) => (
            <section key={group}>
              <h2 className="mb-3 text-lg font-semibold text-zinc-700">{group}</h2>
              <div className="space-y-3">
                {items.map((resource) => (
                  <div
                    key={resource.id}
                    className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    <h3 className="font-medium text-zinc-800">{resource.title}</h3>
                    {resource.description && (
                      <p className="mt-1 text-sm text-zinc-500">{resource.description}</p>
                    )}
                    {resource.external_links && resource.external_links.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(resource.external_links as { label: string; url: string }[]).map(
                          (link, i) => (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {link.label || link.url}
                            </a>
                          ),
                        )}
                      </div>
                    )}
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
