"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Word {
  id: string
  word: string
  pronunciation: string | null
  meaning: string | null
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
      <div className="space-y-2">
        {paginatedWords.map((w) => (
          <div
            key={w.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">Palabra</p>
                <p className="font-medium text-zinc-800 dark:text-zinc-100">{w.word}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">Pronunciación</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{w.pronunciation ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">Significado</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{w.meaning ?? "—"}</p>
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
              className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
