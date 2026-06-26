import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import RoleplayEditor from "./RoleplayEditor"

export default async function EditRoleplayPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: roleplay } = await supabase
    .from("roleplays")
    .select("*")
    .eq("id", id)
    .single()

  if (!roleplay) notFound()

  const { data: lines } = await supabase
    .from("roleplay_lines")
    .select("id, actor_name, line_text, line_order")
    .eq("roleplay_id", id)
    .order("line_order", { ascending: true })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/teacher/class-dashboard/roleplays"
        className="press-bouncy inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
      >
        <ArrowLeft className="h-5 w-5" />
        Volver a roleplays
      </Link>

      <h1 className="animate-fade-in text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100">
        Editar roleplay
      </h1>

      <RoleplayEditor roleplay={roleplay} lines={lines ?? []} />
    </div>
  )
}
