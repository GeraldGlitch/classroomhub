import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookText } from "lucide-react"
import ReadingParagraph from "./ReadingParagraph"

export default async function StudentReadingPage({
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

  const { data: reading } = await supabase
    .from("readings")
    .select("id, title, text, topic_group")
    .eq("id", id)
    .eq("teacher_id", teacherId)
    .single()

  if (!reading) notFound()

  return (
    <div className="space-y-6">
      <Link
        href="/student/readings"
        className="press-bouncy inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
      >
        <ArrowLeft className="h-5 w-5" />
        Volver a lecturas
      </Link>

      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <BookText className="h-7 w-7" />
        </div>
        <div>
          <h1 className="page-title">{reading.title}</h1>
          {reading.topic_group && (
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {reading.topic_group}
            </p>
          )}
        </div>
      </div>

      <ReadingParagraph text={reading.text} />
    </div>
  )
}
