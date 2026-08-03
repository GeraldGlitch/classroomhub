"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { z } from "zod"

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function loginAdmin(prevState: unknown, formData: FormData) {
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: "Email o contraseña inválidos" }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword(parsed.data)

    if (error) {
      return { error: error.message === "Invalid login credentials"
        ? "Email o contraseña incorrectos"
        : "Error al iniciar sesión" }
    }

    const { data: isAdmin } = await supabase.rpc("is_admin")

    if (!isAdmin) {
      await supabase.auth.signOut()
      return { error: "No autorizado" }
    }
  } catch (e) {
    console.error("loginAdmin error:", e)
    return { error: "Error al conectar con el servidor" }
  }

  redirect("/admin/licenses")
}
