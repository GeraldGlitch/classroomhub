import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Drama } from "lucide-react"
import RoleplayScript from "./RoleplayScript"

export default async function StudentRoleplayPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const teacherId = cookieStore.get("teacher_id")?.value
  const studentId = cookieStore.get("student_id")?.value
  if (!teacherId || !studentId) redirect("/login")

  const supabase = await createClient()

  const { data: roleplay } = await supabase
    .from("roleplays")
    .select("id, title, description, topic_group")
    .eq("id", id)
    .eq("teacher_id", teacherId)
    .single()

  if (!roleplay) notFound()

  const { data: lines } = await supabase
    .from("roleplay_lines")
    .select("id, actor_name, line_text, line_order")
    .eq("roleplay_id", id)
    .order("line_order", { ascending: true })

  return (
    <div className="space-y-6">
      <Link
        href="/student/roleplays"
        className="press-bouncy inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
      >
        <ArrowLeft className="h-5 w-5" />
        Volver a roleplays
      </Link>

      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
          <Drama className="h-7 w-7" />
        </div>
        <div>
          <h1 className="page-title">{roleplay.title}</h1>
          {roleplay.topic_group && (
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {roleplay.topic_group}
            </p>
          )}
        </div>
      </div>

      {roleplay.description && (
        <div className="card animate-fade-in-up p-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {roleplay.description}
          </p>
        </div>
      )}

      <RoleplayScript lines={lines ?? []} />
    </div>
  )
}
