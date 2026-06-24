import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FileText, CheckCircle2, ListTodo, BookCheck } from "lucide-react"

export default async function StudentQuestionnairesPage() {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_id")?.value
  if (!studentId) redirect("/login")

  const supabase = await createClient()
  const { data: stats } = await supabase
    .from("questionnaire_stats")
    .select("*")
    .eq("student_id", studentId)
    .single()

  const correct = stats?.correct_answers ?? 0
  const total = stats?.total_answers ?? 0
  const completed = stats?.completed_questionnaires ?? 0
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div className="space-y-6">
      <h1 className="animate-fade-in text-2xl font-bold text-zinc-800 dark:text-zinc-100">Cuestionarios</h1>

      {!stats ? (
        <div className="flex animate-fade-in flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <FileText className="h-10 w-10 animate-bounce-subtle text-zinc-300 dark:text-zinc-600" />
          <p className="text-sm text-zinc-400 dark:text-zinc-500">Aún no hay datos de cuestionarios</p>
        </div>
      ) : (
        <div className="animate-fade-in-up space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Correctas
              </div>
              <p className="mt-1 text-2xl font-bold text-zinc-800 dark:text-zinc-100">{correct}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <ListTodo className="h-4 w-4 text-indigo-500" />
                Totales
              </div>
              <p className="mt-1 text-2xl font-bold text-zinc-800 dark:text-zinc-100">{total}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <BookCheck className="h-4 w-4 text-orange-500" />
                Cuestionarios
              </div>
              <p className="mt-1 text-2xl font-bold text-zinc-800 dark:text-zinc-100">{completed}</p>
            </div>
          </div>

          {total > 0 && (
            <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-950">
              <p className="text-sm text-indigo-800 dark:text-indigo-300">
                <span className="font-bold">{correct}</span> respuestas correctas de{" "}
                <span className="font-bold">{total}</span> preguntas en{" "}
                <span className="font-bold">{completed}</span> cuestionarios.
              </p>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs font-medium text-indigo-700 dark:text-indigo-400">
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
      )}
    </div>
  )
}
