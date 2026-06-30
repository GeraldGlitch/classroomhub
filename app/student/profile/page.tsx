import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Smile, AlertTriangle, ArrowRight } from "lucide-react"
import SpeakButton from "@/components/SpeakButton"

export default async function StudentProfilePage() {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_id")?.value
  if (!studentId) redirect("/login")

  const supabase = await createClient()
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single()

  if (!student) redirect("/login")

  const fields = (student.custom_fields ?? {}) as Record<string, string>

  const { data: topFailedWords } = await supabase
    .from("difficult_words")
    .select("id, word, pronunciation, meaning, fail_count")
    .eq("student_id", studentId)
    .gt("fail_count", 0)
    .order("fail_count", { ascending: false })
    .limit(3)

  return (
    <div className="space-y-6">
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <Image src="/login.svg" alt="" width={36} height={36} className="h-9 w-9" />
        </div>
        <h1 className="page-title">Mi Perfil</h1>
      </div>

      <div className="card animate-fade-in-up p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-indigo-100 shadow-sm dark:bg-indigo-950">
            <Smile className="h-11 w-11 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100">{student.name}</h2>
          </div>
        </div>
      </div>

      {Object.keys(fields).length > 0 && (
        <div className="card animate-fade-in-up p-6">
          <h3 className="section-title mb-4 text-base">
            Información adicional
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(fields).map(([key, value]) => (
              <div key={key} className="rounded-xl bg-zinc-50 p-3 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-sm dark:bg-zinc-800">
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">{key}</p>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {topFailedWords && topFailedWords.length > 0 && (
        <div className="card animate-fade-in-up p-6">
          <h3 className="section-title mb-4 text-base">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Palabras más falladas
          </h3>
          <div className="space-y-3">
            {topFailedWords.map((w, i) => (
              <div
                key={w.id}
                className="rounded-xl bg-zinc-50 p-4 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-sm dark:bg-zinc-800"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="font-bold text-zinc-800 dark:text-zinc-100">{w.word}</p>
                    <SpeakButton word={w.word} />
                  </div>
                  <span className="flex-shrink-0 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:bg-red-950 dark:text-red-400">
                    {w.fail_count}x
                  </span>
                </div>
                {w.pronunciation && (
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {w.pronunciation}
                  </p>
                )}
                {w.meaning && (
                  <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-300">
                    {w.meaning}
                  </p>
                )}
              </div>
            ))}
          </div>
          <Link
            href="/student/words"
            className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Ver todas las palabras
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}
