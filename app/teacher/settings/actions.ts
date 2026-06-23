"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function regenerateCode(_prev: unknown, _formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  const newCode = Math.random().toString(36).substring(2, 8).toLowerCase()

  const { error } = await supabase
    .from("teachers")
    .update({ access_code: newCode })
    .eq("id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/teacher/settings")
  return { code: newCode }
}
