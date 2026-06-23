"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

function normaliseUrl(url: string) {
  if (!/^https?:\/\//i.test(url)) return `https://${url}`
  return url
}

function buildLinks(rawUrl: string | undefined) {
  const url = (rawUrl ?? "").trim()
  if (!url) return []
  return [{ label: url, url: normaliseUrl(url) }]
}

const resourceSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  topic_group: z.string().optional(),
  external_url: z.string().optional(),
})

export async function createResource(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const topic_group = formData.get("topic_group") as string
  const external_url = formData.get("external_url") as string

  const parsed = resourceSchema.safeParse({ title, description, topic_group, external_url })
  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  const { error } = await supabase.from("resources").insert({
    teacher_id: user.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    topic_group: parsed.data.topic_group || null,
    external_links: buildLinks(parsed.data.external_url),
  })

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/resources")
  redirect("/teacher/class-dashboard/resources")
}

export async function updateResource(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const topic_group = formData.get("topic_group") as string
  const external_url = formData.get("external_url") as string

  const parsed = resourceSchema.safeParse({ title, description, topic_group, external_url })
  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("resources")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      topic_group: parsed.data.topic_group || null,
      external_links: buildLinks(parsed.data.external_url),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/resources")
  redirect("/teacher/class-dashboard/resources")
}

export async function deleteResource(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()
  const { error } = await supabase.from("resources").delete().eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/resources")
}
