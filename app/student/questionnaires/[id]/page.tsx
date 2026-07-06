import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import QuestionnaireDetail from "./QuestionnaireDetail"

export default async function StudentQuestionnaireDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_id")?.value
  if (!studentId) redirect("/login")

  const supabase = await createClient()

  const { data: questionnaire } = await supabase
    .from("questionnaires")
    .select("id, title, description, instructions, cooldown_minutes, topic_group")
    .eq("id", id)
    .eq("published", true)
    .single()

  if (!questionnaire) notFound()

  const { count: questionCount } = await supabase
    .from("questionnaire_questions")
    .select("id", { count: "exact", head: true })
    .eq("questionnaire_id", id)

  // Get previous attempts
  const { data: attempts } = await supabase
    .from("questionnaire_attempts")
    .select("id, started_at, finished_at, score, total_questions, percentage")
    .eq("student_id", studentId)
    .eq("questionnaire_id", id)
    .order("started_at", { ascending: false })

  // Check last attempt for cooldown
  let lastAttemptDate: string | null = null
  if (attempts && attempts.length > 0) {
    const lastFinished = attempts.find((a) => a.finished_at)
    if (lastFinished) lastAttemptDate = lastFinished.finished_at
  }

  return (
    <QuestionnaireDetail
      questionnaire={questionnaire}
      questionCount={questionCount ?? 0}
      attempts={attempts ?? []}
      lastAttemptDate={lastAttemptDate}
    />
  )
}
