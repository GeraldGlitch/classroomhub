import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BookMarked, ListTodo, CheckCircle2 } from "lucide-react"
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

  const { data: wordStats } = await supabase
    .from("word_stats")
    .select("*")
    .eq("student_id", studentId)
    .single()

  const erradas = wordStats?.mispronounced_count ?? 0
  const totales = wordStats?.total_read_count ?? 0
  const aciertos = Math.max(totales - erradas, 0)
  const percentage = totales > 0 ? Math.round((aciertos / totales) * 100) : 0

  return (
    <div className="space-y-6">
      <h1 className="animate-fade-in text-2xl font-bold text-zinc-800 dark:text-zinc-100">Palabras difíciles</h1>

      {wordStats && totales > 0 && (
        <div className="animate-fade-in-up space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <ListTodo className="h-4 w-4 text-indigo-500" />
                Totales leídas
              </div>
              <p className="mt-1 text-2xl font-bold text-zinc-800 dark:text-zinc-100">{totales}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <CheckCircle2 className="h-4 w-4 text-red-500" />
                Erradas
              </div>
              <p className="mt-1 text-2xl font-bold text-zinc-800 dark:text-zinc-100">{erradas}</p>
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
            <p className="text-sm text-green-800 dark:text-green-300">
              <span className="font-bold">{aciertos}</span> aciertos de{" "}
              <span className="font-bold">{totales}</span> palabras leídas{" "}
              <span className="text-green-700 dark:text-green-400">
                ({erradas} erradas)
              </span>
              .
            </p>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs font-medium text-green-700 dark:text-green-400">
                <span>Aciertos</span>
                <span>{percentage}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-green-100 dark:bg-green-900">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {!words || words.length === 0 ? (
        <div className="flex animate-fade-in flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <BookMarked className="h-10 w-10 animate-bounce-subtle text-zinc-300 dark:text-zinc-600" />
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No tienes palabras registradas aún</p>
        </div>
      ) : (
        <WordList words={words} />
      )}
    </div>
  )
}
