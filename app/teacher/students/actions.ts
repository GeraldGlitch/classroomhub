"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

export interface StudentActionState {
  error?: string
  success?: boolean
}

const studentSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  access_code: z.string().min(3, "El código debe tener al menos 3 caracteres").max(50),
})

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toLowerCase()
}

async function getTeacherPrefix(
  supabase: Awaited<ReturnType<typeof createClient>>,
  teacherId: string,
): Promise<string> {
  const { data } = await supabase
    .from("teachers")
    .select("access_code")
    .eq("id", teacherId)
    .single()
  return data?.access_code ?? ""
}

function buildFullCode(prefix: string, studentCode: string): string {
  if (studentCode.startsWith(`${prefix}-`)) return studentCode
  const clean = studentCode.includes("-") ? studentCode.split("-").slice(-1)[0] : studentCode
  return `${prefix}-${clean}`
}

async function isCodeTaken(
  supabase: Awaited<ReturnType<typeof createClient>>,
  teacherId: string,
  code: string,
  excludeId?: string,
): Promise<boolean> {
  let query = supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("teacher_id", teacherId)
    .eq("access_code", code)
  if (excludeId) query = query.neq("id", excludeId)
  const { count } = await query
  return (count ?? 0) > 0
}

export async function createStudent(prevState: unknown, formData: FormData) {
  const name = formData.get("name") as string
  const accessCode = formData.get("access_code") as string

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  const prefix = await getTeacherPrefix(supabase, user.id)
  const rawCode = accessCode?.trim() || generateCode()
  const fullCode = buildFullCode(prefix, rawCode)

  const parsed = studentSchema.safeParse({ name, access_code: fullCode })
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first.message }
  }

  if (await isCodeTaken(supabase, user.id, parsed.data.access_code)) {
    return { error: "Ese código ya está en uso por otro estudiante" }
  }

  const { error } = await supabase.from("students").insert({
    teacher_id: user.id,
    name: parsed.data.name,
    access_code: parsed.data.access_code,
  })

  if (error) return { error: error.message }
  revalidatePath("/teacher/students")
  redirect("/teacher/students")
}

export async function updateStudent(prevState: unknown, formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const accessCode = formData.get("access_code") as string

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  const prefix = await getTeacherPrefix(supabase, user.id)
  const fullCode = buildFullCode(prefix, accessCode)

  const parsed = studentSchema.safeParse({ name, access_code: fullCode })
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first.message }
  }

  if (await isCodeTaken(supabase, user.id, parsed.data.access_code, id)) {
    return { error: "Ese código ya está en uso por otro estudiante" }
  }

  const { error } = await supabase
    .from("students")
    .update({
      name: parsed.data.name,
      access_code: parsed.data.access_code,
    })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/students")
  revalidatePath(`/teacher/students/${id}`)
  return { success: true }
}

export async function regenerateStudentCode(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { error: "Falta el ID del estudiante" }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  const prefix = await getTeacherPrefix(supabase, user.id)

  for (let i = 0; i < 5; i++) {
    const studentCode = generateCode()
    const fullCode = `${prefix}-${studentCode}`
    if (!(await isCodeTaken(supabase, user.id, fullCode, id))) {
      return { code: fullCode }
    }
  }
  const fallback = `${prefix}-${Math.random().toString(36).substring(2, 12).toLowerCase()}`
  return { code: fallback }
}

export async function deleteStudent(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()
  const { error } = await supabase.from("students").delete().eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/students")
}
