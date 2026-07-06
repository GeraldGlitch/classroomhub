"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import SpeakButton from "@/components/SpeakButton"

interface VaultWord {
  id: string
  word: string
  pronunciation: string | null
  meaning: string | null
}

const ITEMS_PER_PAGE = 10

export default function VaultWordList({ words }: { words: VaultWord[] }) {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    setSearchTerm(query.trim().toLowerCase())
    setPage(1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const filtered = useMemo(() => {
    if (!searchTerm) return words
    return words.filter((w) =>
      w.word.toLowerCase().includes(searchTerm),
    )
  }, [words, searchTerm])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  const paginatedWords = filtered.slice(start, end)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar palabras..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 transition-all duration-150 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-600 dark:focus:ring-indigo-900"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
        </div>
        <button
          onClick={handleSearch}
          className="press-bouncy rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 active:scale-90 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          aria-label="Buscar"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {searchTerm && (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para &ldquo;{searchTerm}&rdquo;
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Search className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {searchTerm ? "No se encontraron palabras" : "No hay palabras en la bóveda aún"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2.5">
            {paginatedWords.map((w, i) => (
            <div
              key={w.id}
              className="card card-hover animate-fade-in-up p-4"
              style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
            >
              <div className="grid gap-2 sm:grid-cols-3">
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
              </div>
            </div>
          ))}
        </div>

        {filtered.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {start + 1}–{Math.min(end, filtered.length)} de {filtered.length}
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
        </>
      )}
    </div>
  )
}
