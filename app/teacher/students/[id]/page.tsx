import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BookMarked, ArrowLeft, Smile } from "lucide-react"
import StudentProfileForm from "./StudentProfileForm"
import StatsForm from "./StatsForm"

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: student } = await supabase
    .from("students")
    .select("id, name, access_code, custom_fields")
    .eq("id", id)
    .single()

  if (!student) notFound()

  const { data: wordCount } = await supabase
    .from("difficult_words")
    .select("id", { count: "exact", head: true })
    .eq("student_id", id)

  const { data: stats } = await supabase
    .from("questionnaire_stats")
    .select("*")
    .eq("student_id", id)
    .single()

  return (
    <div className="space-y-6">
      <Link
        href="/teacher/students"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a estudiantes
      </Link>

      <div className="flex items-start gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950">
          <Smile className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1">
          <h1 className="animate-fade-in text-2xl font-bold text-zinc-800 dark:text-zinc-100">{student.name}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Perfil de estudiante</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-zinc-700 dark:text-zinc-300">Información</h2>
            <StudentProfileForm student={student} />
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-zinc-700 dark:text-zinc-300">Estadísticas de cuestionarios</h2>
            <StatsForm studentId={id} stats={stats ?? null} />
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href={`/teacher/students/${id}/words`}
            className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <BookMarked className="h-8 w-8 text-indigo-500" />
              <div>
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Palabras difíciles</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{wordCount?.length ?? 0} palabras</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
