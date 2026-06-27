"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const readingSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  text: z.string().min(1, "El texto es obligatorio"),
  topic_group: z.string().optional(),
})

export async function createReading(formData: FormData) {
  const title = formData.get("title") as string
  const text = formData.get("text") as string
  const topic_group = formData.get("topic_group") as string

  const parsed = readingSchema.safeParse({ title, text, topic_group })
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first.message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  const { error } = await supabase
    .from("readings")
    .insert({
      teacher_id: user.id,
      title: parsed.data.title,
      text: parsed.data.text,
      topic_group: parsed.data.topic_group || null,
    })

  if (error) return { error: error.message }

  revalidatePath("/teacher/class-dashboard/readings")
  redirect("/teacher/class-dashboard/readings")
}

export async function updateReading(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const text = formData.get("text") as string
  const topic_group = formData.get("topic_group") as string

  const parsed = readingSchema.safeParse({ title, text, topic_group })
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first.message }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("readings")
    .update({
      title: parsed.data.title,
      text: parsed.data.text,
      topic_group: parsed.data.topic_group || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/readings")
  revalidatePath(`/teacher/class-dashboard/readings/${id}/edit`)
  return { success: true }
}

export async function deleteReading(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()
  const { error } = await supabase.from("readings").delete().eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/readings")
}
