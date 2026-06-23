import { createClient } from "@/lib/supabase/server"
import AccessCodeManager from "./AccessCodeManager"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: teacher } = await supabase
    .from("teachers")
    .select("access_code")
    .eq("id", user!.id)
    .single()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-800">Ajustes</h1>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-zinc-700">Código de acceso para estudiantes</h2>
        <AccessCodeManager currentCode={teacher?.access_code ?? ""} />
      </div>
    </div>
  )
}
