import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import ResourceForm from "../../ResourceForm"

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: resource } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .single()

  if (!resource) notFound()

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 animate-fade-in text-2xl font-bold text-zinc-800 dark:text-zinc-100">Editar recurso</h1>
      <ResourceForm resource={resource} />
    </div>
  )
}
