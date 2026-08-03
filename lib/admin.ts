import { createClient } from "@/lib/supabase/server"

export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("No autenticado")

  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (!isAdmin) throw new Error("No autorizado")

  return { supabase, userId: user.id }
}
