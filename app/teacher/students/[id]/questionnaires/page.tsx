import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BarChart3 } from "lucide-react"

export default async function StudentQuestionnairesHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: student } = await supabase
    .from("students")
    .select("id, name")
    .eq("id", id)
    .single()

  if (!student) notFound()

  const { data: attempts } = await supabase
    .from("questionnaire_attempts")
    .select("id, questionnaire_id, score, total_questions, percentage, started_at, finished_at")
    .eq("student_id", id)
    .not("finished_at", "is", null)
    .order("started_at", { ascending: false })

  // Get questionnaire titles
  const questionnaireIds = [...new Set((attempts ?? []).map((a) => a.questionnaire_id))]
  const questionnaires: Record<string, string> = {}
  for (const qId of questionnaireIds) {
    const { data: q } = await supabase
      .from("questionnaires")
      .select("id, title")
      .eq("id", qId)
      .single()
    if (q) questionnaires[q.id] = q.title
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/teacher/students/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al perfil
      </Link>

      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <BarChart3 className="h-7 w-7" />
        </div>
        <h1 className="page-title">Historial de cuestionarios: {student.name}</h1>
      </div>

      <div className="card p-6">
        {(attempts ?? []).length === 0 ? (
          <div className="text-center py-8 text-sm text-zinc-400 dark:text-zinc-500">
            Este estudiante no ha realizado ningún cuestionario
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-xs font-semibold text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                    <th className="pb-2 pr-4">Cuestionario</th>
                    <th className="pb-2 pr-4">Fecha</th>
                    <th className="pb-2 pr-4">Puntaje</th>
                    <th className="pb-2 pr-4">Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts!.map((a) => (
                    <tr key={a.id} className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-2 pr-4 font-bold text-zinc-800 dark:text-zinc-100">
                        {questionnaires[a.questionnaire_id] ?? "Desconocido"}
                      </td>
                      <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-300">
                        {new Date(a.started_at).toLocaleDateString("es-MX", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="py-2 pr-4">
                        <span className="font-bold text-zinc-800 dark:text-zinc-100">
                          {a.score ?? "-"} / {a.total_questions ?? "-"}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        <span className={`font-bold ${(a.percentage ?? 0) >= 60 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          {a.percentage ?? 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 sm:hidden">
              {attempts!.map((a) => (
                <div key={a.id} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800">
                  <div className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                    {questionnaires[a.questionnaire_id] ?? "Desconocido"}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {new Date(a.started_at).toLocaleDateString("es-MX", {
                        day: "numeric", month: "short",
                      })}
                    </span>
                    <span className={`font-bold ${(a.percentage ?? 0) >= 60 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {a.percentage ?? 0}% ({a.score ?? "-"}/{a.total_questions ?? "-"})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
