"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deletePackage(formData: FormData) {
  const id = formData.get("id") as string

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "No autorizado" }

  const { error } = await supabase
    .from("packages")
    .delete()
    .eq("id", id)
    .eq("teacher_id", user.id)

  if (error) return { error: error.message }
  revalidatePath("/teacher/packages")
}
