import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ReadingForm from "../../ReadingForm"

export default async function EditReadingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: reading } = await supabase
    .from("readings")
    .select("*")
    .eq("id", id)
    .single()

  if (!reading) notFound()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/teacher/class-dashboard/readings"
        className="press-bouncy inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
      >
        <ArrowLeft className="h-5 w-5" />
        Volver a lecturas
      </Link>

      <h1 className="animate-fade-in text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100">
        Editar lectura
      </h1>

      <ReadingForm reading={reading} />
    </div>
  )
}
