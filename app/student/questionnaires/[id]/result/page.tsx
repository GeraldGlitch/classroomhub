import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import ResultCard from "./ResultCard"

export default async function ResultPage({
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

  const { data: attempt } = await supabase
    .from("questionnaire_attempts")
    .select("id, student_id, score, total_questions, percentage, started_at, finished_at")
    .eq("id", attemptId)
    .single()

  if (!attempt) notFound()
  if (attempt.student_id !== studentId) redirect(`/student/questionnaires/${id}`)

  // Get answer details with questions and options
  const { data: answers } = await supabase
    .from("questionnaire_attempt_answers")
    .select("id, question_id, selected_options, is_correct")
    .eq("attempt_id", attemptId)

  const answerDetails: {
    questionId: string
    questionText: string
    questionType: string
    selectedOptions: string[]
    isCorrect: boolean
    correctOptions: { id: string; option_text: string }[]
    selectedTexts: string[]
  }[] = []

  for (const answer of answers ?? []) {
    const { data: question } = await supabase
      .from("questionnaire_questions")
      .select("question_text, question_type")
      .eq("id", answer.question_id)
      .single()

    const { data: allOptions } = await supabase
      .from("questionnaire_options")
      .select("id, option_text, is_correct")
      .eq("question_id", answer.question_id)
      .order("sort_order", { ascending: true })

    const correctOpts = (allOptions ?? []).filter((o) => o.is_correct)
    const selectedTexts = (allOptions ?? [])
      .filter((o) => answer.selected_options.includes(o.id))
      .map((o) => o.option_text)

    answerDetails.push({
      questionId: answer.question_id,
      questionText: question?.question_text ?? "",
      questionType: question?.question_type ?? "single",
      selectedOptions: answer.selected_options,
      isCorrect: answer.is_correct,
      correctOptions: correctOpts.map((o) => ({ id: o.id, option_text: o.option_text })),
      selectedTexts,
    })
  }

  const timeSpent = attempt.finished_at
    ? Math.round((new Date(attempt.finished_at).getTime() - new Date(attempt.started_at).getTime()) / 1000)
    : 0

  return (
    <ResultCard
      score={attempt.score ?? 0}
      totalQuestions={attempt.total_questions ?? 0}
      percentage={attempt.percentage ?? 0}
      timeSpent={timeSpent}
      questionnaireId={id}
      answerDetails={answerDetails}
    />
  )
}
