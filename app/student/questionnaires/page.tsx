import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FileText } from "lucide-react"

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Cuestionarios</h1>

      {!stats ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <FileText className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
          <p className="text-sm text-zinc-400 dark:text-zinc-500">Aún no hay datos de cuestionarios</p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="rounded-lg bg-indigo-50 p-6 text-center dark:bg-indigo-950">
            <p className="text-lg text-indigo-800 dark:text-indigo-300">
              <span className="font-bold">{stats.correct_answers}</span> respuestas correctas de{" "}
              <span className="font-bold">{stats.total_answers}</span> preguntas en{" "}
              <span className="font-bold">{stats.completed_questionnaires}</span> cuestionarios.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
