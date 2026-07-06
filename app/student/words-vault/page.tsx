import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Image from "next/image"
import VaultWordList from "./VaultWordList"

export default async function StudentWordsVaultPage() {
  const cookieStore = await cookies()
  const teacherId = cookieStore.get("teacher_id")?.value
  const studentId = cookieStore.get("student_id")?.value
  if (!teacherId || !studentId) redirect("/login")

  const supabase = await createClient()
  const { data: words } = await supabase
    .from("words_vault")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("word", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <Image src="/words-vault.svg" alt="" width={36} height={36} className="h-9 w-9" />
        </div>
        <h1 className="page-title">
          Bóveda de palabras
        </h1>
        {words?.length ? (
          <span className="ml-1 self-end mb-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            {words.length} palabras
          </span>
        ) : null}
      </div>

      {!words || words.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Image src="/words-vault.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No hay palabras en la bóveda aún</p>
        </div>
      ) : (
        <VaultWordList words={words} />
      )}
    </div>
  )
}
