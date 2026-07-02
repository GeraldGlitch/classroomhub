import { createClient } from "@/lib/supabase/server"
import { BookOpen, Plus } from "lucide-react"
import Link from "next/link"
import TeacherResourcesList from "./TeacherResourcesList"

export default async function ResourcesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("teacher_id", user!.id)
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
        <div className="page-header animate-fade-in-up">
          <div className="page-header-icon">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="page-title">Recursos</h1>
        </div>
        <Link
          href="/teacher/class-dashboard/resources/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nuevo recurso
        </Link>
      </div>

      <TeacherResourcesList grouped={grouped} allResources={list} />
    </div>
  )
}
