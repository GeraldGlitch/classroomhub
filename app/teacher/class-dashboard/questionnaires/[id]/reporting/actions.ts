"use server"

import { createClient } from "@/lib/supabase/server"

export async function getQuestionnaireStats(questionnaireId: string) {
  const supabase = await createClient()

  const { count: totalAttempts } = await supabase
    .from("questionnaire_attempts")
    .select("id", { count: "exact", head: true })
    .eq("questionnaire_id", questionnaireId)
    .not("finished_at", "is", null)

  const { data: scores } = await supabase
    .from("questionnaire_attempts")
    .select("score, total_questions, percentage, student_id, started_at")
    .eq("questionnaire_id", questionnaireId)
    .not("finished_at", "is", null)

  const avgScore = scores && scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + (s.percentage ?? 0), 0) / scores.length * 100) / 100
    : 0

  const highest = scores && scores.length > 0
    ? Math.max(...scores.map((s) => s.percentage ?? 0))
    : 0

  const lowest = scores && scores.length > 0
    ? Math.min(...scores.map((s) => s.percentage ?? 0))
    : 0

  return { totalAttempts, avgScore, highest, lowest, scores: scores ?? [] }
}
