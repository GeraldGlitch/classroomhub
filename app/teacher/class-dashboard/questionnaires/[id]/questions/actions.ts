"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const questionSchema = z.object({
  questionnaire_id: z.string().uuid(),
  question_text: z.string().min(1, "La pregunta no puede estar vacía"),
  question_type: z.enum(["single", "multiple"]),
})

const optionSchema = z.object({
  question_id: z.string().uuid(),
  option_text: z.string().min(1, "La opción no puede estar vacía"),
  is_correct: z.coerce.boolean(),
})

export async function addQuestion(formData: FormData) {
  const questionnaire_id = formData.get("questionnaire_id") as string
  const question_text = formData.get("question_text") as string
  const question_type = formData.get("question_type") as string

  const parsed = questionSchema.safeParse({ questionnaire_id, question_text, question_type })
  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()

  const { count: maxOrder } = await supabase
    .from("questionnaire_questions")
    .select("sort_order", { count: "exact", head: true })
    .eq("questionnaire_id", questionnaire_id)

  const { error } = await supabase.from("questionnaire_questions").insert({
    questionnaire_id: parsed.data.questionnaire_id,
    question_text: parsed.data.question_text,
    question_type: parsed.data.question_type,
    sort_order: (maxOrder ?? 0) + 1,
  })

  if (error) return { error: error.message }
  revalidatePath(`/teacher/class-dashboard/questionnaires/${questionnaire_id}/questions`)
}

export async function updateQuestion(formData: FormData) {
  const id = formData.get("id") as string
  const questionnaire_id = formData.get("questionnaire_id") as string
  const question_text = formData.get("question_text") as string
  const question_type = formData.get("question_type") as string

  const parsed = questionSchema.safeParse({ questionnaire_id, question_text, question_type })
  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("questionnaire_questions")
    .update({
      question_text: parsed.data.question_text,
      question_type: parsed.data.question_type,
    })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath(`/teacher/class-dashboard/questionnaires/${questionnaire_id}/questions`)
}

export async function deleteQuestion(formData: FormData) {
  const id = formData.get("id") as string
  const questionnaire_id = formData.get("questionnaire_id") as string

  const supabase = await createClient()
  const { error } = await supabase.from("questionnaire_questions").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath(`/teacher/class-dashboard/questionnaires/${questionnaire_id}/questions`)
}

export async function addOption(formData: FormData) {
  const question_id = formData.get("question_id") as string
  const option_text = formData.get("option_text") as string
  const is_correct = formData.get("is_correct") === "on"

  const parsed = optionSchema.safeParse({ question_id, option_text, is_correct })
  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()

  const { count: maxOrder } = await supabase
    .from("questionnaire_options")
    .select("sort_order", { count: "exact", head: true })
    .eq("question_id", question_id)

  const { error } = await supabase.from("questionnaire_options").insert({
    question_id: parsed.data.question_id,
    option_text: parsed.data.option_text,
    is_correct: parsed.data.is_correct,
    sort_order: (maxOrder ?? 0) + 1,
  })

  if (error) return { error: error.message }

  const { data: q } = await supabase
    .from("questionnaire_questions")
    .select("questionnaire_id")
    .eq("id", question_id)
    .single()

  if (q) revalidatePath(`/teacher/class-dashboard/questionnaires/${q.questionnaire_id}/questions`)
}

export async function updateOption(formData: FormData) {
  const id = formData.get("id") as string
  const option_text = formData.get("option_text") as string
  const is_correct = formData.get("is_correct") === "on"

  const supabase = await createClient()

  const { data: opt } = await supabase
    .from("questionnaire_options")
    .select("question_id")
    .eq("id", id)
    .single()

  if (!opt) return { error: "Opción no encontrada" }

  const { error } = await supabase
    .from("questionnaire_options")
    .update({ option_text, is_correct })
    .eq("id", id)

  if (error) return { error: error.message }

  const { data: q } = await supabase
    .from("questionnaire_questions")
    .select("questionnaire_id")
    .eq("id", opt.question_id)
    .single()

  if (q) revalidatePath(`/teacher/class-dashboard/questionnaires/${q.questionnaire_id}/questions`)
}

export async function deleteOption(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()

  const { data: opt } = await supabase
    .from("questionnaire_options")
    .select("question_id")
    .eq("id", id)
    .single()

  if (!opt) return { error: "Opción no encontrada" }

  const { error } = await supabase.from("questionnaire_options").delete().eq("id", id)
  if (error) return { error: error.message }

  const { data: q } = await supabase
    .from("questionnaire_questions")
    .select("questionnaire_id")
    .eq("id", opt.question_id)
    .single()

  if (q) revalidatePath(`/teacher/class-dashboard/questionnaires/${q.questionnaire_id}/questions`)
}

export async function reorderQuestions(questionnaireId: string, orderedIds: string[]) {
  const supabase = await createClient()
  const updates = orderedIds.map((id, index) => ({
    id,
    sort_order: index + 1,
  }))
  for (const u of updates) {
    await supabase.from("questionnaire_questions").update({ sort_order: u.sort_order }).eq("id", u.id)
  }
  revalidatePath(`/teacher/class-dashboard/questionnaires/${questionnaireId}/questions`)
}

export async function reorderOptions(questionId: string, orderedIds: string[]) {
  const supabase = await createClient()
  const updates = orderedIds.map((id, index) => ({
    id,
    sort_order: index + 1,
  }))
  for (const u of updates) {
    await supabase.from("questionnaire_options").update({ sort_order: u.sort_order }).eq("id", u.id)
  }

  const { data: q } = await supabase
    .from("questionnaire_questions")
    .select("questionnaire_id")
    .eq("id", questionId)
    .single()

  if (q) revalidatePath(`/teacher/class-dashboard/questionnaires/${q.questionnaire_id}/questions`)
}
