"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const prefixSchema = z.object({
  prefix: z
    .string()
    .min(3, "El prefijo debe tener al menos 3 caracteres")
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/, "Solo letras, números, guiones y guiones bajos"),
})

export async function updateTeacherPrefix(formData: FormData) {
  const prefix = formData.get("prefix") as string

  const parsed = prefixSchema.safeParse({ prefix })
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first.message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  // Get current teacher data (to know old prefix)
  const { data: teacher } = await supabase
    .from("teachers")
    .select("access_code")
    .eq("id", user.id)
    .single()

  if (!teacher) return { error: "Profesor no encontrado" }

  const oldPrefix = teacher.access_code
  const newPrefix = parsed.data.prefix

  // If prefix didn't change, just return success
  if (oldPrefix === newPrefix) {
    revalidatePath("/teacher/settings")
    return { success: true }
  }

  // Update teacher prefix (UNIQUE constraint in DB prevents duplicates)
  const { error: updateError } = await supabase
    .from("teachers")
    .update({ access_code: newPrefix })
    .eq("id", user.id)

  if (updateError?.code === "23505") {
    return { error: "Ese prefijo ya está en uso por otro profesor" }
  }
  if (updateError) return { error: updateError.message }

  // Update all existing student codes that use the old prefix
  const prefixPattern = `${oldPrefix}-%`
  const { data: students } = await supabase
    .from("students")
    .select("id, access_code")
    .eq("teacher_id", user.id)
    .like("access_code", prefixPattern)

  if (students && students.length > 0) {
    const updates = students.map((s) => ({
      id: s.id,
      new_code: `${newPrefix}${s.access_code.slice(oldPrefix.length)}`,
    }))

    for (const u of updates) {
      await supabase
        .from("students")
        .update({ access_code: u.new_code })
        .eq("id", u.id)
    }
  }

  revalidatePath("/teacher/settings")
  revalidatePath("/teacher/students")
  revalidatePath(`/teacher/students/[id]`)
  return { success: true, updated: students?.length ?? 0 }
}

export async function getTeacherData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("teachers")
    .select("id, name, access_code")
    .eq("id", user.id)
    .single()

  return data
}
