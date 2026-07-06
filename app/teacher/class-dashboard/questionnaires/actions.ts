"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const questionnaireSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  instructions: z.string().optional(),
  topic_group: z.string().optional(),
  cooldown_minutes: z.coerce.number().int().min(0).default(30),
})

export async function createQuestionnaire(formData: FormData) {
  const parsed = questionnaireSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    instructions: formData.get("instructions"),
    topic_group: formData.get("topic_group"),
    cooldown_minutes: formData.get("cooldown_minutes"),
  })
  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  const { data, error } = await supabase
    .from("questionnaires")
    .insert({
      teacher_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      instructions: parsed.data.instructions || null,
      topic_group: parsed.data.topic_group || null,
      cooldown_minutes: parsed.data.cooldown_minutes,
    })
    .select("id")
    .single()

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/questionnaires")
  redirect(`/teacher/class-dashboard/questionnaires/${data.id}/questions`)
}

export async function updateQuestionnaire(formData: FormData) {
  const id = formData.get("id") as string
  const parsed = questionnaireSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    instructions: formData.get("instructions"),
    topic_group: formData.get("topic_group"),
    cooldown_minutes: formData.get("cooldown_minutes"),
  })
  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("questionnaires")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      instructions: parsed.data.instructions || null,
      topic_group: parsed.data.topic_group || null,
      cooldown_minutes: parsed.data.cooldown_minutes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/questionnaires")
  redirect("/teacher/class-dashboard/questionnaires")
}

export async function deleteQuestionnaire(formData: FormData) {
  const id = formData.get("id") as string
  const supabase = await createClient()
  const { error } = await supabase.from("questionnaires").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/questionnaires")
}

export async function duplicateQuestionnaire(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  const { data: original } = await supabase
    .from("questionnaires")
    .select("*, questionnaire_questions(*, questionnaire_options(*))")
    .eq("id", id)
    .single()

  if (!original) return { error: "Cuestionario no encontrado" }

  const { data: newQuestionnaire, error: qError } = await supabase
    .from("questionnaires")
    .insert({
      teacher_id: user.id,
      title: `${original.title} (copia)`,
      description: original.description,
      instructions: original.instructions,
      topic_group: original.topic_group,
      cooldown_minutes: original.cooldown_minutes,
      published: false,
    })
    .select("id")
    .single()

  if (qError) return { error: qError.message }

  for (const question of original.questionnaire_questions) {
    const { data: newQuestion } = await supabase
      .from("questionnaire_questions")
      .insert({
        questionnaire_id: newQuestionnaire.id,
        question_text: question.question_text,
        question_type: question.question_type,
        sort_order: question.sort_order,
      })
      .select("id")
      .single()

    if (newQuestion && question.questionnaire_options) {
      await supabase.from("questionnaire_options").insert(
        question.questionnaire_options.map((opt: { option_text: string; is_correct: boolean; sort_order: number }) => ({
          question_id: newQuestion.id,
          option_text: opt.option_text,
          is_correct: opt.is_correct,
          sort_order: opt.sort_order,
        }))
      )
    }
  }

  revalidatePath("/teacher/class-dashboard/questionnaires")
}

export async function publishQuestionnaire(formData: FormData) {
  const id = formData.get("id") as string
  const supabase = await createClient()

  const { count: questionCount } = await supabase
    .from("questionnaire_questions")
    .select("id", { count: "exact", head: true })
    .eq("questionnaire_id", id)

  if (!questionCount || questionCount < 1) {
    return { error: "Debe tener al menos 1 pregunta" }
  }

  const { data: questions } = await supabase
    .from("questionnaire_questions")
    .select("id, question_type")
    .eq("questionnaire_id", id)

  if (!questions) return { error: "Error al validar preguntas" }

  for (const question of questions) {
    const { count: optionCount } = await supabase
      .from("questionnaire_options")
      .select("id", { count: "exact", head: true })
      .eq("question_id", question.id)

    if (!optionCount || optionCount < 2) {
      return { error: "Cada pregunta debe tener al menos 2 opciones" }
    }

    const { data: correctOptions } = await supabase
      .from("questionnaire_options")
      .select("id")
      .eq("question_id", question.id)
      .eq("is_correct", true)

    if (!correctOptions || correctOptions.length === 0) {
      return { error: "Cada pregunta debe tener al menos 1 opción correcta" }
    }

    if (question.question_type === "single" && correctOptions.length !== 1) {
      return { error: "Las preguntas de opción única deben tener exactamente 1 respuesta correcta" }
    }
  }

  const { error } = await supabase
    .from("questionnaires")
    .update({ published: true, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/questionnaires")
}

export async function archiveQuestionnaire(formData: FormData) {
  const id = formData.get("id") as string
  const supabase = await createClient()
  const { error } = await supabase
    .from("questionnaires")
    .update({ published: false, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/questionnaires")
}
