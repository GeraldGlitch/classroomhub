"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const studentSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
})

export async function createStudent(formData: FormData) {
  const name = formData.get("name") as string
  const customFieldsRaw = formData.get("custom_fields") as string
  const custom_fields = customFieldsRaw ? JSON.parse(customFieldsRaw) : {}

  const parsed = studentSchema.safeParse({ name })
  if (!parsed.success) return { error: "El nombre es obligatorio" }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  const { error } = await supabase.from("students").insert({
    teacher_id: user.id,
    name: parsed.data.name,
    custom_fields,
  })

  if (error) return { error: error.message }
  revalidatePath("/teacher/students")
  redirect("/teacher/students")
}

export async function updateStudent(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const customFieldsRaw = formData.get("custom_fields") as string
  const custom_fields = customFieldsRaw ? JSON.parse(customFieldsRaw) : {}

  const parsed = studentSchema.safeParse({ name })
  if (!parsed.success) return { error: "El nombre es obligatorio" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("students")
    .update({ name: parsed.data.name, custom_fields })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/students")
  redirect("/teacher/students")
}

export async function deleteStudent(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()
  const { error } = await supabase.from("students").delete().eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/students")
}
