import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { Plus, Pencil, Globe } from "lucide-react"
import Link from "next/link"
import DeleteRoleplayButton from "./DeleteRoleplayButton"

export default async function RoleplaysPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: roleplays } = await supabase
    .from("roleplays")
    .select("id, title, description, topic_group, created_at, updated_at")
    .eq("teacher_id", user!.id)
    .order("topic_group", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  const list = roleplays ?? []

  const { data: lineCounts } = list.length > 0
    ? await supabase
        .from("roleplay_lines")
        .select("roleplay_id")
        .in("roleplay_id", list.map((r) => r.id))
    : { data: [] }

  const counts = (lineCounts ?? []).reduce<Record<string, number>>((acc, l) => {
    acc[l.roleplay_id] = (acc[l.roleplay_id] ?? 0) + 1
    return acc
  }, {})
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
          <div className="page-header-icon bg-purple-100 dark:bg-purple-950">
            <Image src="/roleplays.svg" alt="" width={36} height={36} className="h-9 w-9" />
          </div>
          <h1 className="page-title">Roleplays</h1>
        </div>
        <Link
          href="/teacher/class-dashboard/roleplays/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nuevo roleplay
        </Link>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Image src="/roleplays.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-600 dark:text-zinc-400">No hay roleplays aún</h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Crea tu primer roleplay para compartir con la clase
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([group, items]) => (
            <section key={group}>
              <h2 className="section-title mb-3">
                <span className="section-title-icon">
                  <Globe className="h-5 w-5" />
                </span>
                {group}
              </h2>
              <div className="space-y-3">
                {items.map((roleplay, i) => (
                  <div
                    key={roleplay.id}
                    className="card card-hover animate-fade-in-up p-4"
                    style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/teacher/class-dashboard/roleplays/${roleplay.id}/edit`}
                        className="flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 rounded-lg"
                      >
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{roleplay.title}</h3>
                        {roleplay.description && (
                          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{roleplay.description}</p>
                        )}
                        <p className="mt-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                          {counts[roleplay.id] ?? 0} líneas
                        </p>
                      </Link>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/teacher/class-dashboard/roleplays/${roleplay.id}/edit`}
                          aria-label="Editar roleplay"
                          className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
                        >
                          <Pencil className="h-5 w-5" />
                        </Link>
                        <DeleteRoleplayButton id={roleplay.id} title={roleplay.title} />
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
