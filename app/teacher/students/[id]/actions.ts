"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const statsSchema = z.object({
  student_id: z.string(),
  correct_answers: z.coerce.number().min(0),
  total_answers: z.coerce.number().min(0),
  completed_questionnaires: z.coerce.number().min(0),
})

export async function updateStats(formData: FormData) {
  const parsed = statsSchema.safeParse({
    student_id: formData.get("student_id"),
    correct_answers: formData.get("correct_answers"),
    total_answers: formData.get("total_answers"),
    completed_questionnaires: formData.get("completed_questionnaires"),
  })

  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()
  const { data: existing } = await supabase
    .from("questionnaire_stats")
    .select("id")
    .eq("student_id", parsed.data.student_id)
    .single()

  if (existing) {
    const { error } = await supabase
      .from("questionnaire_stats")
      .update({
        correct_answers: parsed.data.correct_answers,
        total_answers: parsed.data.total_answers,
        completed_questionnaires: parsed.data.completed_questionnaires,
        updated_at: new Date().toISOString(),
      })
      .eq("student_id", parsed.data.student_id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from("questionnaire_stats")
      .insert({ ...parsed.data, updated_at: new Date().toISOString() })
    if (error) return { error: error.message }
  }

  revalidatePath(`/teacher/students/${parsed.data.student_id}`)
}
