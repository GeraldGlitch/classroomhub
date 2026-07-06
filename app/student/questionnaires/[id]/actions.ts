"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function startAttempt(questionnaireId: string) {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_id")?.value
  if (!studentId) return { error: "No autorizado" }

  const supabase = await createClient()

  // Check cooldown
  const { data: questionnaire } = await supabase
    .from("questionnaires")
    .select("cooldown_minutes")
    .eq("id", questionnaireId)
    .single()

  if (!questionnaire) return { error: "Cuestionario no encontrado" }

  if (questionnaire.cooldown_minutes > 0) {
    const { data: lastAttempt } = await supabase
      .from("questionnaire_attempts")
      .select("finished_at")
      .eq("student_id", studentId)
      .eq("questionnaire_id", questionnaireId)
      .not("finished_at", "is", null)
      .order("finished_at", { ascending: false })
      .limit(1)
      .single()

    if (lastAttempt?.finished_at) {
      const elapsed = (Date.now() - new Date(lastAttempt.finished_at).getTime()) / 1000 / 60
      if (elapsed < questionnaire.cooldown_minutes) {
        const remaining = Math.ceil(questionnaire.cooldown_minutes - elapsed)
        return { error: `Debes esperar ${remaining} minuto(s) antes de intentarlo de nuevo` }
      }
    }
  }

  const { data: attempt, error } = await supabase
    .from("questionnaire_attempts")
    .insert({
      student_id: studentId,
      questionnaire_id: questionnaireId,
    })
    .select("id")
    .single()

  if (error) return { error: error.message }
  if (!attempt) return { error: "Error al crear intento" }

  revalidatePath(`/student/questionnaires/${questionnaireId}`)
  return { attemptId: attempt.id }
}

export async function checkAnswer(questionId: string, selectedOptionIds: string[]) {
  const supabase = await createClient()

  const { data: question } = await supabase
    .from("questionnaire_questions")
    .select("question_type")
    .eq("id", questionId)
    .single()

  if (!question) return { error: "Pregunta no encontrada" }

  const { data: correctOptions } = await supabase
    .from("questionnaire_options")
    .select("id")
    .eq("question_id", questionId)
    .eq("is_correct", true)

  const correctIds = (correctOptions ?? []).map((o) => o.id)
  let isCorrect = false

  if (question.question_type === "single") {
    isCorrect = selectedOptionIds.length === 1 && correctIds.length === 1 && selectedOptionIds[0] === correctIds[0]
  } else {
    const sortedSelected = [...selectedOptionIds].sort()
    const sortedCorrect = [...correctIds].sort()
    isCorrect =
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((id, i) => id === sortedCorrect[i])
  }

  return { isCorrect, correctOptionIds: correctIds }
}

interface AnswerInput {
  questionId: string
  selectedOptionIds: string[]
}

export async function submitAttempt(attemptId: string, answers: AnswerInput[]) {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_id")?.value
  if (!studentId) return { error: "No autorizado" }

  const supabase = await createClient()

  // Verify attempt belongs to student and is not finished
  const { data: attempt } = await supabase
    .from("questionnaire_attempts")
    .select("id, student_id, finished_at, questionnaire_id")
    .eq("id", attemptId)
    .single()

  if (!attempt) return { error: "Intento no encontrado" }
  if (attempt.student_id !== studentId) return { error: "No autorizado" }
  if (attempt.finished_at) return { error: "Este intento ya fue entregado" }

  // Get all questions for the questionnaire
  const { data: questions } = await supabase
    .from("questionnaire_questions")
    .select("id, question_type")
    .eq("questionnaire_id", attempt.questionnaire_id)
    .order("sort_order", { ascending: true })

  if (!questions) return { error: "Error al cargar preguntas" }

  // Compute correctness for each answer
  const answerResults = []
  let score = 0

  for (const question of questions) {
    const userAnswer = answers.find((a) => a.questionId === question.id)
    const selectedIds = userAnswer?.selectedOptionIds ?? []

    const { data: correctOptions } = await supabase
      .from("questionnaire_options")
      .select("id")
      .eq("question_id", question.id)
      .eq("is_correct", true)

    const correctIds = (correctOptions ?? []).map((o) => o.id)
    let isCorrect = false

    if (question.question_type === "single") {
      isCorrect = selectedIds.length === 1 && correctIds.length === 1 && selectedIds[0] === correctIds[0]
    } else {
      const sortedSelected = [...selectedIds].sort()
      const sortedCorrect = [...correctIds].sort()
      isCorrect =
        sortedSelected.length === sortedCorrect.length &&
        sortedSelected.every((id, i) => id === sortedCorrect[i])
    }

    if (isCorrect) score++

    answerResults.push({
      attempt_id: attemptId,
      question_id: question.id,
      selected_options: selectedIds,
      is_correct: isCorrect,
    })
  }

  const totalQuestions = questions.length
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 10000) / 100 : 0

  // Update attempt
  const { error: updateError } = await supabase
    .from("questionnaire_attempts")
    .update({
      finished_at: new Date().toISOString(),
      score,
      total_questions: totalQuestions,
      percentage,
    })
    .eq("id", attemptId)

  if (updateError) return { error: updateError.message }

  // Insert answers
  const { error: insertError } = await supabase
    .from("questionnaire_attempt_answers")
    .insert(answerResults)

  if (insertError) return { error: insertError.message }

  revalidatePath(`/student/questionnaires/${attempt.questionnaire_id}`)
  return { success: true, attemptId }
}
