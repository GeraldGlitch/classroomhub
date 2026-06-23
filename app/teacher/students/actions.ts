"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const studentSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  access_code: z.string().min(3, "El código debe tener al menos 3 caracteres").max(20),
})

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toLowerCase()
}

async function isCodeTaken(
  supabase: Awaited<ReturnType<typeof createClient>>,
  code: string,
  excludeId?: string,
): Promise<boolean> {
  let query = supabase.from("students").select("id", { count: "exact", head: true }).eq("access_code", code)
  if (excludeId) query = query.neq("id", excludeId)
  const { count } = await query
  return (count ?? 0) > 0
}

export async function createStudent(formData: FormData) {
  const name = formData.get("name") as string
  const accessCode = formData.get("access_code") as string
  const customFieldsRaw = formData.get("custom_fields") as string
  const custom_fields = customFieldsRaw ? JSON.parse(customFieldsRaw) : {}

  const code = accessCode?.trim() || generateCode()

  const parsed = studentSchema.safeParse({ name, access_code: code })
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first.message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  if (await isCodeTaken(supabase, parsed.data.access_code)) {
    return { error: "Ese código ya está en uso por otro estudiante" }
  }

  const { error } = await supabase.from("students").insert({
    teacher_id: user.id,
    name: parsed.data.name,
    access_code: parsed.data.access_code,
    custom_fields,
  })

  if (error) return { error: error.message }
  revalidatePath("/teacher/students")
  redirect("/teacher/students")
}

export async function updateStudent(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const accessCode = formData.get("access_code") as string
  const customFieldsRaw = formData.get("custom_fields") as string
  const custom_fields = customFieldsRaw ? JSON.parse(customFieldsRaw) : {}

  const parsed = studentSchema.safeParse({ name, access_code: accessCode })
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first.message }
  }

  const supabase = await createClient()

  if (await isCodeTaken(supabase, parsed.data.access_code, id)) {
    return { error: "Ese código ya está en uso por otro estudiante" }
  }

  const { error } = await supabase
    .from("students")
    .update({
      name: parsed.data.name,
      access_code: parsed.data.access_code,
      custom_fields,
    })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/students")
  redirect("/teacher/students")
}

export async function regenerateStudentCode(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { error: "Falta el ID del estudiante" }

  const supabase = await createClient()
  let newCode: string
  for (let i = 0; i < 5; i++) {
    newCode = generateCode()
    if (!(await isCodeTaken(supabase, newCode, id))) {
      return { code: newCode }
    }
  }
  return { code: Math.random().toString(36).substring(2, 12).toLowerCase() }
}

export async function deleteStudent(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()
  const { error } = await supabase.from("students").delete().eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/students")
}
