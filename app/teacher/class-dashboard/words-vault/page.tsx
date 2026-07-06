import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import WordsVaultManager from "./WordsVaultManager"

export default async function WordsVaultPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: words } = await supabase
    .from("words_vault")
    .select("*")
    .eq("teacher_id", user!.id)
    .order("word", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <Image src="/words-vault.svg" alt="" width={36} height={36} className="h-9 w-9" />
        </div>
        <h1 className="page-title">Bóveda de palabras</h1>
        {words?.length ? (
          <span className="ml-1 self-end mb-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            {words.length} palabras
          </span>
        ) : null}
      </div>

      <WordsVaultManager words={words ?? []} />
    </div>
  )
}
