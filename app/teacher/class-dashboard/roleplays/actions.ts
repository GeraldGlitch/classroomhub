"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const roleplaySchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  topic_group: z.string().optional(),
})

const lineSchema = z.object({
  roleplay_id: z.string().min(1),
  actor_name: z.string().min(1, "El actor es obligatorio"),
  line_text: z.string().min(1, "La línea es obligatoria"),
})

function parseLinesJson(raw: string | null): { actor_name: string; line_text: string }[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((l) => l && typeof l === "object")
      .map((l) => ({
        actor_name: String(l.actor_name ?? "").trim(),
        line_text: String(l.line_text ?? "").trim(),
      }))
      .filter((l) => l.actor_name && l.line_text)
  } catch {
    return []
  }
}

export async function createRoleplay(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const topic_group = formData.get("topic_group") as string
  const linesRaw = formData.get("lines") as string | null

  const parsed = roleplaySchema.safeParse({ title, description, topic_group })
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first.message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  const { data, error } = await supabase
    .from("roleplays")
    .insert({
      teacher_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      topic_group: parsed.data.topic_group || null,
    })
    .select("id")
    .single()

  if (error) return { error: error.message }

  const lines = parseLinesJson(linesRaw)
  if (lines.length > 0) {
    const rows = lines.map((l, i) => ({
      roleplay_id: data.id,
      actor_name: l.actor_name,
      line_text: l.line_text,
      line_order: i,
    }))
    const { error: linesError } = await supabase.from("roleplay_lines").insert(rows)
    if (linesError) return { error: linesError.message }
  }

  revalidatePath("/teacher/class-dashboard/roleplays")
  redirect("/teacher/class-dashboard/roleplays")
}

export async function updateRoleplay(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const topic_group = formData.get("topic_group") as string

  const parsed = roleplaySchema.safeParse({ title, description, topic_group })
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first.message }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("roleplays")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      topic_group: parsed.data.topic_group || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/roleplays")
  revalidatePath(`/teacher/class-dashboard/roleplays/${id}/edit`)
  return { success: true }
}

export async function deleteRoleplay(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()
  const { error } = await supabase.from("roleplays").delete().eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/roleplays")
}

export async function addLine(formData: FormData) {
  const parsed = lineSchema.safeParse({
    roleplay_id: formData.get("roleplay_id"),
    actor_name: formData.get("actor_name"),
    line_text: formData.get("line_text"),
  })

  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first.message }
  }

  const supabase = await createClient()

  const { data: maxRow } = await supabase
    .from("roleplay_lines")
    .select("line_order")
    .eq("roleplay_id", parsed.data.roleplay_id)
    .order("line_order", { ascending: false })
    .limit(1)
    .single()

  const nextOrder = (maxRow?.line_order ?? -1) + 1

  const { error } = await supabase.from("roleplay_lines").insert({
    roleplay_id: parsed.data.roleplay_id,
    actor_name: parsed.data.actor_name,
    line_text: parsed.data.line_text,
    line_order: nextOrder,
  })

  if (error) return { error: error.message }
  revalidatePath(`/teacher/class-dashboard/roleplays/${parsed.data.roleplay_id}/edit`)
}

export async function updateLine(formData: FormData) {
  const id = formData.get("id") as string
  const actor_name = formData.get("actor_name") as string
  const line_text = formData.get("line_text") as string

  const parsed = z
    .object({
      actor_name: z.string().min(1, "El actor es obligatorio"),
      line_text: z.string().min(1, "La línea es obligatoria"),
    })
    .safeParse({ actor_name, line_text })

  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first.message }
  }

  const supabase = await createClient()
  const { data: line, error: lookupError } = await supabase
    .from("roleplay_lines")
    .select("roleplay_id")
    .eq("id", id)
    .single()

  if (lookupError || !line) return { error: "No encontrado" }

  const { error } = await supabase
    .from("roleplay_lines")
    .update({ actor_name: parsed.data.actor_name, line_text: parsed.data.line_text })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath(`/teacher/class-dashboard/roleplays/${line.roleplay_id}/edit`)
}

export async function deleteLine(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()
  const { data: line, error: lookupError } = await supabase
    .from("roleplay_lines")
    .select("roleplay_id")
    .eq("id", id)
    .single()

  if (lookupError || !line) return { error: "No encontrado" }

  const { error } = await supabase.from("roleplay_lines").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath(`/teacher/class-dashboard/roleplays/${line.roleplay_id}/edit`)
}

export async function moveLineUp(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()
  const { data: line } = await supabase
    .from("roleplay_lines")
    .select("id, roleplay_id, line_order")
    .eq("id", id)
    .single()

  if (!line) return

  const { data: prev } = await supabase
    .from("roleplay_lines")
    .select("id, line_order")
    .eq("roleplay_id", line.roleplay_id)
    .lt("line_order", line.line_order)
    .order("line_order", { ascending: false })
    .limit(1)
    .single()

  if (!prev) return

  const tmp = line.line_order
  await supabase.from("roleplay_lines").update({ line_order: prev.line_order }).eq("id", line.id)
  await supabase.from("roleplay_lines").update({ line_order: tmp }).eq("id", prev.id)

  revalidatePath(`/teacher/class-dashboard/roleplays/${line.roleplay_id}/edit`)
}

export async function moveLineDown(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()
  const { data: line } = await supabase
    .from("roleplay_lines")
    .select("id, roleplay_id, line_order")
    .eq("id", id)
    .single()

  if (!line) return

  const { data: next } = await supabase
    .from("roleplay_lines")
    .select("id, line_order")
    .eq("roleplay_id", line.roleplay_id)
    .gt("line_order", line.line_order)
    .order("line_order", { ascending: true })
    .limit(1)
    .single()

  if (!next) return

  const tmp = line.line_order
  await supabase.from("roleplay_lines").update({ line_order: next.line_order }).eq("id", line.id)
  await supabase.from("roleplay_lines").update({ line_order: tmp }).eq("id", next.id)

  revalidatePath(`/teacher/class-dashboard/roleplays/${line.roleplay_id}/edit`)
}
