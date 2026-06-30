import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BookMarked, ArrowLeft } from "lucide-react"
import StudentProfileForm from "./StudentProfileForm"
import StatsForm from "./StatsForm"
import WordStatsForm from "./WordStatsForm"
import { getAvatarSrc } from "@/lib/avatar"

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: student } = await supabase
    .from("students")
    .select("id, name, avatar_url, access_code, custom_fields")
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
        className="press-bouncy inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
      >
        <ArrowLeft className="h-5 w-5" />
        Volver a estudiantes
      </Link>

      <div className="flex items-start gap-5">
        <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-indigo-100 shadow-sm dark:bg-indigo-950 overflow-hidden">
          {student.avatar_url ? (
            <img src={getAvatarSrc(student.avatar_url)!} alt={student.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {student.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 pt-1">
          <h1 className="animate-fade-in text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100">{student.name}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Perfil de estudiante</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="section-title mb-4 text-base">
              Información
            </h2>
            <StudentProfileForm student={student} />
          </div>

          <div className="card p-5">
            <h2 className="section-title mb-4 text-base">
              Estadísticas de cuestionarios
            </h2>
            <StatsForm studentId={id} stats={stats ?? null} />
          </div>

          <div className="card p-5">
            <h2 className="section-title mb-4 text-base">
              Estadísticas de lectura
            </h2>
            <WordStatsForm studentId={id} stats={wordStats ?? null} />
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href={`/teacher/students/${id}/words`}
            className="card card-hover group block p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-500 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6 dark:bg-indigo-950 dark:text-indigo-400">
                <BookMarked className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-zinc-800 dark:text-zinc-100">Palabras difíciles</h3>
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
                <div className="mb-1 flex justify-between text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
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
