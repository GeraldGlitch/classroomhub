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
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a {student.name}
      </Link>

      <h1 className="text-2xl font-bold text-zinc-800">
        Palabras difíciles — {student.name}
      </h1>

      <WordsManager studentId={id} words={words ?? []} />
    </div>
  )
}
