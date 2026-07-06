import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { redirect } from "next/navigation"
import { CheckCircle2, ListTodo, BookCheck } from "lucide-react"
import QuestionnaireList from "./QuestionnaireList"

export default async function StudentQuestionnairesPage() {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_id")?.value
  const teacherId = cookieStore.get("teacher_id")?.value
  if (!studentId || !teacherId) redirect("/login")

  const supabase = await createClient()
  const { data: stats } = await supabase
    .from("questionnaire_stats")
    .select("*")
    .eq("student_id", studentId)
    .single()

  // Fetch published questionnaires
  const { data: questionnaires } = await supabase
    .from("questionnaires")
    .select("id, title, description, topic_group, cooldown_minutes")
    .eq("published", true)
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false })

  const list = questionnaires ?? []

  // Get question counts
  const questionCounts: Record<string, number> = {}
  for (const q of list) {
    const { count } = await supabase
      .from("questionnaire_questions")
      .select("id", { count: "exact", head: true })
      .eq("questionnaire_id", q.id)
    questionCounts[q.id] = count ?? 0
  }

  const grouped = list.reduce<Record<string, typeof list>>((acc, r) => {
    const key = r.topic_group ?? "General"
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  const correct = stats?.correct_answers ?? 0
  const total = stats?.total_answers ?? 0
  const completed = stats?.completed_questionnaires ?? 0
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <Image src="/questionnaries.svg" alt="" width={36} height={36} className="h-9 w-9" />
        </div>
        <h1 className="page-title">Cuestionarios</h1>
      </div>

      {/* Existing stats summary */}
      {stats ? (
        <div className="card animate-fade-in-up space-y-4 p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="stat-tile">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Correctas
              </div>
              <p className="mt-1 text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{correct}</p>
            </div>
            <div className="stat-tile">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <ListTodo className="h-5 w-5 text-indigo-500" />
                Totales
              </div>
              <p className="mt-1 text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{total}</p>
            </div>
            <div className="stat-tile">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <BookCheck className="h-5 w-5 text-orange-500" />
                Completados
              </div>
              <p className="mt-1 text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{completed}</p>
            </div>
          </div>

          {total > 0 && (
            <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950">
              <p className="text-sm text-indigo-800 dark:text-indigo-300">
                <span className="font-bold">{correct}</span> respuestas correctas de{" "}
                <span className="font-bold">{total}</span> preguntas en{" "}
                <span className="font-bold">{completed}</span> cuestionarios.
              </p>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs font-bold text-indigo-700 dark:text-indigo-400">
                  <span>Aciertos</span>
                  <span>{percentage}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Image src="/questionnaries.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">Aún no hay datos de cuestionarios</p>
        </div>
      )}

      {/* Questionnaire list below stats */}
      <div>
        <h2 className="section-title mb-4">
          <span className="section-title-icon">
            <BookCheck className="h-5 w-5" />
          </span>
          Cuestionarios disponibles
        </h2>
        <QuestionnaireList grouped={grouped} allQuestionnaires={list} questionCounts={questionCounts} />
      </div>
    </div>
  )
}
