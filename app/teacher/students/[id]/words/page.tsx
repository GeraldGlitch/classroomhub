import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import WordsManager from "./WordsManager"

export default async function StudentWordsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: student } = await supabase
    .from("students")
    .select("name")
    .eq("id", id)
    .single()

  if (!student) notFound()

  const { data: words } = await supabase
    .from("difficult_words")
    .select("*")
    .eq("student_id", id)
    .order("word")

  return (
    <div className="space-y-6">
      <Link
        href={`/teacher/students/${id}`}
        className="press-bouncy inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        <ArrowLeft className="h-5 w-5" />
        Volver a {student.name}
      </Link>

      <h1 className="animate-fade-in text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100">
        Palabras difíciles — {student.name}
      </h1>

      <WordsManager studentId={id} words={words ?? []} />
    </div>
  )
}
