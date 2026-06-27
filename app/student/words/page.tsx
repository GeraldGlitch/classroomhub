import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Image from "next/image"
import { ListTodo, CheckCircle2 } from "lucide-react"
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
    .order("fail_count", { ascending: false })

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
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <Image src="/palabras-dificiles.svg" alt="" width={36} height={36} className="h-9 w-9" />
        </div>
        <h1 className="page-title">
          Palabras difíciles
        </h1>
        {words?.length ? (
          <span className="ml-1 self-end mb-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            {words.length} palabras
          </span>
        ) : null}
      </div>

      {wordStats && totales > 0 && (
        <div className="card animate-fade-in-up space-y-4 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="stat-tile">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <ListTodo className="h-5 w-5 text-indigo-500" />
                Totales leídas
              </div>
              <p className="mt-1 text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{totales}</p>
            </div>
            <div className="stat-tile">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <CheckCircle2 className="h-5 w-5 text-red-500" />
                Erradas
              </div>
              <p className="mt-1 text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">{erradas}</p>
            </div>
          </div>

          <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950">
            <p className="text-sm text-green-800 dark:text-green-300">
              <span className="font-bold">{aciertos}</span> aciertos de{" "}
              <span className="font-bold">{totales}</span> palabras leídas{" "}
              <span className="text-green-700 dark:text-green-400">
                ({erradas} erradas)
              </span>
              .
            </p>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs font-bold text-green-700 dark:text-green-400">
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
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Image src="/palabras-dificiles.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No tienes palabras registradas aún</p>
        </div>
      ) : (
        <WordList words={words} />
      )}
    </div>
  )
}
