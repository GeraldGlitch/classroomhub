import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ResourcesList from "./ResourcesList"

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
      <h1 className="animate-fade-in text-2xl font-bold text-zinc-800 dark:text-zinc-100">Recursos</h1>
      <ResourcesList grouped={grouped} />
    </div>
  )
}
