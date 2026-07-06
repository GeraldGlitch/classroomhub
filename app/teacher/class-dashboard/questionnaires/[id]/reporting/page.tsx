import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BarChart3, Users, Trophy, TrendingDown } from "lucide-react"
import { getQuestionnaireStats } from "./actions"

export default async function ReportingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: questionnaire } = await supabase
    .from("questionnaires")
    .select("id, title, published")
    .eq("id", id)
    .single()

  if (!questionnaire) notFound()

  const stats = await getQuestionnaireStats(id)

  // Group attempts by student
  const studentMap: Record<string, { studentId: string; studentName: string; attempts: typeof stats.scores; bestScore: number }> = {}
  for (const s of stats.scores) {
    if (!studentMap[s.student_id]) {
      const { data: student } = await supabase
        .from("students")
        .select("id, name")
        .eq("id", s.student_id)
        .single()

      studentMap[s.student_id] = {
        studentId: s.student_id,
        studentName: student?.name ?? "Desconocido",
        attempts: [],
        bestScore: 0,
      }
    }
    studentMap[s.student_id].attempts.push(s)
    if ((s.percentage ?? 0) > studentMap[s.student_id].bestScore) {
      studentMap[s.student_id].bestScore = s.percentage ?? 0
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/teacher/class-dashboard/questionnaires/${id}/questions`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a preguntas
      </Link>

      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <BarChart3 className="h-7 w-7" />
        </div>
        <h1 className="page-title">Reportes: {questionnaire.title}</h1>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="stat-tile">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <Users className="h-5 w-5 text-indigo-500" />
            Intentos
          </div>
          <p className="mt-1 text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{stats.totalAttempts}</p>
        </div>
        <div className="stat-tile">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Promedio
          </div>
          <p className="mt-1 text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{stats.avgScore}%</p>
        </div>
        <div className="stat-tile">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <Trophy className="h-5 w-5 text-green-500" />
            Mayor
          </div>
          <p className="mt-1 text-2xl font-extrabold text-green-600 dark:text-green-400">{stats.highest}%</p>
        </div>
        <div className="stat-tile">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <TrendingDown className="h-5 w-5 text-red-500" />
            Menor
          </div>
          <p className="mt-1 text-2xl font-extrabold text-red-600 dark:text-red-400">{stats.lowest}%</p>
        </div>
      </div>

      {/* Per-student table */}
      <div className="card p-6">
        <h2 className="section-title mb-4">
          <span className="section-title-icon">
            <Users className="h-5 w-5" />
          </span>
          Estudiantes
        </h2>

        {Object.keys(studentMap).length === 0 ? (
          <div className="text-center py-8 text-sm text-zinc-400 dark:text-zinc-500">
            No hay intentos registrados
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-xs font-semibold text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                    <th className="pb-2 pr-4">Estudiante</th>
                    <th className="pb-2 pr-4">Intentos</th>
                    <th className="pb-2 pr-4">Mejor puntaje</th>
                    <th className="pb-2 pr-4">Último intento</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(studentMap).map((entry) => {
                    const lastAttempt = entry.attempts[entry.attempts.length - 1]
                    return (
                      <tr key={entry.studentId} className="border-b border-zinc-100 dark:border-zinc-800">
                        <td className="py-2 pr-4">
                          <Link
                            href={`/teacher/students/${entry.studentId}/questionnaires`}
                            className="font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            {entry.studentName}
                          </Link>
                        </td>
                        <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-300">{entry.attempts.length}</td>
                        <td className="py-2 pr-4">
                          <span className="font-bold text-green-600 dark:text-green-400">{entry.bestScore}%</span>
                        </td>
                        <td className="py-2 pr-4 text-zinc-500 dark:text-zinc-400">
                          {lastAttempt?.started_at
                            ? new Date(lastAttempt.started_at).toLocaleDateString("es-MX", {
                                day: "numeric", month: "short", year: "numeric",
                              })
                            : "-"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 sm:hidden">
              {Object.values(studentMap).map((entry) => {
                const lastAttempt = entry.attempts[entry.attempts.length - 1]
                return (
                  <div key={entry.studentId} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800">
                    <Link
                      href={`/teacher/students/${entry.studentId}/questionnaires`}
                      className="font-bold text-indigo-600 dark:text-indigo-400"
                    >
                      {entry.studentName}
                    </Link>
                    <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                      <span>{entry.attempts.length} intentos</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{entry.bestScore}%</span>
                      {lastAttempt?.started_at && (
                        <span className="text-xs">
                          {new Date(lastAttempt.started_at).toLocaleDateString("es-MX", {
                            day: "numeric", month: "short",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
