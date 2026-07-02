import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { Plus } from "lucide-react"
import Link from "next/link"
import RoleplaysList from "./RoleplaysList"

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

      <RoleplaysList roleplays={list} counts={counts} />
    </div>
  )
}
