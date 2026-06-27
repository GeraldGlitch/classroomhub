import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { redirect } from "next/navigation"
import RoleplaysList from "./RoleplaysList"

export default async function StudentRoleplaysPage() {
  const cookieStore = await cookies()
  const teacherId = cookieStore.get("teacher_id")?.value
  const studentId = cookieStore.get("student_id")?.value
  if (!teacherId || !studentId) redirect("/login")

  const supabase = await createClient()
  const { data: roleplays } = await supabase
    .from("roleplays")
    .select("id, title, description, topic_group")
    .eq("teacher_id", teacherId)
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
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon bg-purple-100 dark:bg-purple-950">
          <Image src="/roleplays.svg" alt="" width={28} height={28} className="h-7 w-7" />
        </div>
        <h1 className="page-title">Roleplays</h1>
      </div>
      <RoleplaysList grouped={grouped} counts={counts} />
    </div>
  )
}
