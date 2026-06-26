"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import SpeakButton from "@/components/SpeakButton"

interface Word {
  id: string
  word: string
  pronunciation: string | null
  meaning: string | null
  fail_count: number
}

const ITEMS_PER_PAGE = 10

export default function WordList({ words }: { words: Word[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(words.length / ITEMS_PER_PAGE)

  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  const paginatedWords = words.slice(start, end)

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        {paginatedWords.map((w, i) => (
          <div
            key={w.id}
            className="card card-hover animate-fade-in-up p-4"
            style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
          >
            <div className="grid gap-2 sm:grid-cols-4">
              <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">Palabra</p>
                <div className="flex items-center gap-1">
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">{w.word}</p>
                  <SpeakButton word={w.word} />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">Pronunciación</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{w.pronunciation ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">Significado</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{w.meaning ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">Veces fallada</p>
                <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{w.fail_count ?? 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {words.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {start + 1}–{Math.min(end, words.length)} de {words.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="press-bouncy rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="press-bouncy rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
