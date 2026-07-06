"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ClipboardList } from "lucide-react"

interface Questionnaire {
  id: string
  title: string
  description: string | null
  topic_group: string | null
  cooldown_minutes: number | null
}

export default function QuestionnaireList({
  grouped,
  allQuestionnaires,
  questionCounts,
}: {
  grouped: Record<string, Questionnaire[]>
  allQuestionnaires: Questionnaire[]
  questionCounts: Record<string, number>
}) {
  const [query, setQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    setSearchTerm(query.trim().toLowerCase())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const filtered = useMemo(() => {
    if (!searchTerm) return allQuestionnaires
    return allQuestionnaires.filter((item) =>
      item.title.toLowerCase().includes(searchTerm)
    )
  }, [allQuestionnaires, searchTerm])

  if (allQuestionnaires.length === 0) {
    return (
      <div className="empty-state animate-fade-in">
        <div className="empty-state-icon animate-bob">
          <Image src="/questionnaries.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
        </div>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">No hay cuestionarios disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar cuestionarios..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 transition-all duration-150 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-600 dark:focus:ring-indigo-900"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
        </div>
        <button
          onClick={handleSearch}
          className="press-bouncy rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 active:scale-90 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
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
          <div className="empty-state-icon">
            <Search className="h-7 w-7" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No se encontraron cuestionarios</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([group, items]) => {
            let filteredItems = searchTerm
              ? items.filter((item) => item.title.toLowerCase().includes(searchTerm))
              : items
            if (filteredItems.length === 0) return null
            return (
              <section key={group}>
                <h2 className="section-title mb-3">
                  <span className="section-title-icon">
                    <ClipboardList className="h-5 w-5" />
                  </span>
                  {group}
                </h2>
                <div className="space-y-3">
                  {filteredItems.map((q, i) => (
                    <Link
                      key={q.id}
                      href={`/student/questionnaires/${q.id}`}
                      className="card card-hover animate-fade-in-up block p-4"
                      style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
                    >
                      <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{q.title}</h3>
                      {q.description && (
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {q.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                        {questionCounts[q.id] ?? 0} pregunta{(questionCounts[q.id] ?? 0) !== 1 ? "s" : ""}
                        {q.cooldown_minutes ? ` · ${q.cooldown_minutes} min de espera` : ""}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
