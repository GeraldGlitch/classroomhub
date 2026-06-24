"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const wordSchema = z.object({
  student_id: z.string().optional(),
  word: z.string().min(1, "La palabra es obligatoria"),
  pronunciation: z.string().optional(),
  meaning: z.string().optional(),
  fail_count: z.coerce.number().int().min(1).optional(),
})

export async function addWord(formData: FormData) {
  const parsed = wordSchema.safeParse({
    student_id: formData.get("student_id"),
    word: formData.get("word"),
    pronunciation: formData.get("pronunciation"),
    meaning: formData.get("meaning"),
    fail_count: formData.get("fail_count"),
  })

  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()
  const { error } = await supabase.from("difficult_words").insert({
    student_id: parsed.data.student_id,
    word: parsed.data.word,
    pronunciation: parsed.data.pronunciation || null,
    meaning: parsed.data.meaning || null,
    fail_count: parsed.data.fail_count ?? 1,
  })

  if (error) return { error: error.message }
  revalidatePath(`/teacher/students/${parsed.data.student_id}/words`)
}

export async function updateWord(formData: FormData) {
  const id = formData.get("id") as string
  const parsed = wordSchema.safeParse({
    word: formData.get("word"),
    pronunciation: formData.get("pronunciation"),
    meaning: formData.get("meaning"),
    fail_count: formData.get("fail_count"),
  })

  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()
  const { data: word } = await supabase
    .from("difficult_words")
    .select("student_id")
    .eq("id", id)
    .single()

  if (!word) return { error: "No encontrado" }

  const { error } = await supabase
    .from("difficult_words")
    .update({
      word: parsed.data.word,
      pronunciation: parsed.data.pronunciation || null,
      meaning: parsed.data.meaning || null,
      fail_count: parsed.data.fail_count ?? 1,
    })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath(`/teacher/students/${word.student_id}/words`)
}

export async function deleteWord(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()
  const { data: word } = await supabase
    .from("difficult_words")
    .select("student_id")
    .eq("id", id)
    .single()

  if (!word) return { error: "No encontrado" }

  const { error } = await supabase.from("difficult_words").delete().eq("id", id)

  if (error) return { error: error.message }
  revalidatePath(`/teacher/students/${word.student_id}/words`)
}
