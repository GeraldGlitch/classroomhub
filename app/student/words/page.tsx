import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BookMarked } from "lucide-react"

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
      <h1 className="text-2xl font-bold text-zinc-800">Palabras difíciles</h1>

      {!words || words.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <BookMarked className="h-10 w-10 text-zinc-300" />
          <p className="text-sm text-zinc-400">No tienes palabras registradas aún</p>
        </div>
      ) : (
        <div className="space-y-2">
          {words.map((w) => (
            <div
              key={w.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="grid gap-2 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-zinc-400">Palabra</p>
                  <p className="font-medium text-zinc-800">{w.word}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Pronunciación</p>
                  <p className="text-sm text-zinc-600">{w.pronunciation ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Significado</p>
                  <p className="text-sm text-zinc-600">{w.meaning ?? "—"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
