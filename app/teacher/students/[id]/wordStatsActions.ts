"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const wordStatsSchema = z.object({
  student_id: z.string(),
  mispronounced_count: z.coerce.number().min(0),
  total_read_count: z.coerce.number().min(0),
}).refine(
  (data) => data.mispronounced_count <= data.total_read_count,
  { message: "Erradas no puede ser mayor que totales", path: ["mispronounced_count"] },
)

export async function updateWordStats(formData: FormData) {
  const parsed = wordStatsSchema.safeParse({
    student_id: formData.get("student_id"),
    mispronounced_count: formData.get("mispronounced_count"),
    total_read_count: formData.get("total_read_count"),
  })

  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { error: first.message }
  }

  const supabase = await createClient()
  const { data: existing } = await supabase
    .from("word_stats")
    .select("id")
    .eq("student_id", parsed.data.student_id)
    .single()

  if (existing) {
    const { error } = await supabase
      .from("word_stats")
      .update({
        mispronounced_count: parsed.data.mispronounced_count,
        total_read_count: parsed.data.total_read_count,
        updated_at: new Date().toISOString(),
      })
      .eq("student_id", parsed.data.student_id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from("word_stats")
      .insert({ ...parsed.data, updated_at: new Date().toISOString() })
    if (error) return { error: error.message }
  }

  revalidatePath(`/teacher/students/${parsed.data.student_id}`)
  revalidatePath(`/student/words`)
}
