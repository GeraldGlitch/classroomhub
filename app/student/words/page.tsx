import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BookMarked } from "lucide-react"
import WordList from "./WordList"

export default async function StudentWordsPage() {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_id")?.value
  if (!studentId) redirect("/login")

  const supabase = await createClient()
  const { data: words } = await supabase
    .from("difficult_words")
    .select("*")
    .eq("student_id", studentId)
    .order("word")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Palabras difíciles</h1>

      {!words || words.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <BookMarked className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No tienes palabras registradas aún</p>
        </div>
      ) : (
        <WordList words={words} />
      )}
    </div>
  )
}
