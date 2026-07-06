"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const vaultWordSchema = z.object({
  word: z.string().min(1, "La palabra es obligatoria"),
  pronunciation: z.string().optional(),
  meaning: z.string().optional(),
})

export async function addVaultWord(formData: FormData) {
  const parsed = vaultWordSchema.safeParse({
    word: formData.get("word"),
    pronunciation: formData.get("pronunciation"),
    meaning: formData.get("meaning"),
  })

  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autenticado" }

  const { error } = await supabase.from("words_vault").insert({
    teacher_id: user.id,
    word: parsed.data.word,
    pronunciation: parsed.data.pronunciation || null,
    meaning: parsed.data.meaning || null,
  })

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/words-vault")
  revalidatePath("/student/words-vault")
}

export async function updateVaultWord(formData: FormData) {
  const id = formData.get("id") as string
  const parsed = vaultWordSchema.safeParse({
    word: formData.get("word"),
    pronunciation: formData.get("pronunciation"),
    meaning: formData.get("meaning"),
  })

  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("words_vault")
    .update({
      word: parsed.data.word,
      pronunciation: parsed.data.pronunciation || null,
      meaning: parsed.data.meaning || null,
    })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/words-vault")
  revalidatePath("/student/words-vault")
}

export async function deleteVaultWord(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()
  const { error } = await supabase.from("words_vault").delete().eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/words-vault")
  revalidatePath("/student/words-vault")
}
