import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BookMarked, ArrowLeft, Smile } from "lucide-react"
import StudentProfileForm from "./StudentProfileForm"
import StatsForm from "./StatsForm"
import WordStatsForm from "./WordStatsForm"

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

  const { count } = await supabase
    .from("difficult_words")
    .select("id", { count: "exact", head: true })
    .eq("student_id", id)

  const { data: stats } = await supabase
    .from("questionnaire_stats")
    .select("*")
    .eq("student_id", id)
    .single()

  const { data: wordStats } = await supabase
    .from("word_stats")
    .select("*")
    .eq("student_id", id)
    .single()

  const readCount = wordStats?.total_read_count ?? 0
  const errCount = wordStats?.mispronounced_count ?? 0
  const aciertos = Math.max(readCount - errCount, 0)
  const miniPercentage = readCount > 0 ? Math.round((aciertos / readCount) * 100) : 0

  return (
    <div className="space-y-6">
      <Link
        href="/teacher/students"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
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
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold text-zinc-700 dark:text-zinc-300">Información</h2>
            <StudentProfileForm student={student} />
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold text-zinc-700 dark:text-zinc-300">Estadísticas de cuestionarios</h2>
            <StatsForm studentId={id} stats={stats ?? null} />
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 font-semibold text-zinc-700 dark:text-zinc-300">Estadísticas de lectura</h2>
            <WordStatsForm studentId={id} stats={wordStats ?? null} />
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href={`/teacher/students/${id}/words`}
            className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-800 dark:focus-visible:ring-offset-zinc-950"
          >
            <div className="flex items-center gap-3">
              <BookMarked className="h-8 w-8 flex-shrink-0 text-indigo-500" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Palabras difíciles</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {count ?? 0} palabras
                </p>
                {wordStats && readCount > 0 && (
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {readCount} leídas · {errCount} erradas
                  </p>
                )}
              </div>
            </div>
            {wordStats && readCount > 0 && (
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                  <span>Aciertos</span>
                  <span>{miniPercentage}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${miniPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}
