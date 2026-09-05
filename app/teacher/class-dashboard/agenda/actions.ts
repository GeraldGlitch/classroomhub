"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const eventSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  event_date: z.string().min(1),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
})

const toTimeOrNull = (v: string | undefined) => (v && v.trim() ? v : null)

export async function createEvent(formData: FormData) {
  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    event_date: formData.get("event_date"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
  })

  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  const { error } = await supabase.from("agenda_events").insert({
    teacher_id: user.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    event_date: parsed.data.event_date,
    start_time: toTimeOrNull(parsed.data.start_time),
    end_time: toTimeOrNull(parsed.data.end_time),
  })

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/agenda")
}

export async function updateEvent(formData: FormData) {
  const id = formData.get("id") as string
  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    event_date: formData.get("event_date"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
  })

  if (!parsed.success) return { error: "Datos inválidos" }

  const supabase = await createClient()
  const { error } = await supabase
    .from("agenda_events")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      event_date: parsed.data.event_date,
      start_time: toTimeOrNull(parsed.data.start_time),
      end_time: toTimeOrNull(parsed.data.end_time),
    })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/agenda")
}

export async function deleteEvent(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()
  const { error } = await supabase.from("agenda_events").delete().eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/class-dashboard/agenda")
}
