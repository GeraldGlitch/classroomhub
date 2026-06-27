import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { redirect } from "next/navigation"
import ReadingsList from "./ReadingsList"

export default async function StudentReadingsPage() {
  const cookieStore = await cookies()
  const teacherId = cookieStore.get("teacher_id")?.value
  const studentId = cookieStore.get("student_id")?.value
  if (!teacherId || !studentId) redirect("/login")

  const supabase = await createClient()
  const { data: readings } = await supabase
    .from("readings")
    .select("id, title, text, topic_group")
    .eq("teacher_id", teacherId)
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
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon bg-emerald-100 dark:bg-emerald-950">
          <Image src="/reading.svg" alt="" width={28} height={28} className="h-7 w-7" />
        </div>
        <h1 className="page-title">Lecturas</h1>
      </div>
      <ReadingsList grouped={grouped} />
    </div>
  )
}
