import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import QuizPlayer from "./QuizPlayer"

export default async function AttemptPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ attemptId?: string }>
}) {
  const { id } = await params
  const { attemptId } = await searchParams
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_id")?.value
  if (!studentId) redirect("/login")

  if (!attemptId) redirect(`/student/questionnaires/${id}`)

  const supabase = await createClient()

  // Verify attempt belongs to student and is not finished
  const { data: attempt } = await supabase
    .from("questionnaire_attempts")
    .select("id, student_id, finished_at")
    .eq("id", attemptId)
    .single()

  if (!attempt) notFound()
  if (attempt.student_id !== studentId) redirect(`/student/questionnaires/${id}`)
  if (attempt.finished_at) redirect(`/student/questionnaires/${id}/result?attemptId=${attemptId}`)

  // Get questions WITHOUT revealing correct answers
  const { data: questions } = await supabase
    .from("questionnaire_questions")
    .select("id, question_text, question_type, sort_order")
    .eq("questionnaire_id", id)
    .order("sort_order", { ascending: true })

  if (!questions || questions.length === 0) redirect(`/student/questionnaires/${id}`)

  // Get options WITHOUT is_correct - server filters it
  const optionsByQuestion: Record<string, { id: string; option_text: string; sort_order: number }[]> = {}
  for (const q of questions) {
    const { data: opts } = await supabase
      .from("questionnaire_options")
      .select("id, option_text, sort_order")
      .eq("question_id", q.id)
      .order("sort_order", { ascending: true })
    optionsByQuestion[q.id] = (opts ?? []).map(({ id, option_text, sort_order }) => ({ id, option_text, sort_order }))
  }

  const { data: questionnaire } = await supabase
    .from("questionnaires")
    .select("title, cooldown_minutes")
    .eq("id", id)
    .single()

  return (
    <QuizPlayer
      questionnaireId={id}
      attemptId={attemptId}
      questionnaireTitle={questionnaire?.title ?? ""}
      questions={questions}
      optionsByQuestion={optionsByQuestion}
    />
  )
}
