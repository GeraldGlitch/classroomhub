"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ChevronRight } from "lucide-react"

export interface Reading {
  id: string
  title: string
  text: string
  topic_group: string | null
}

export default function ReadingsList({
  grouped,
}: {
  grouped: Record<string, Reading[]>
}) {
  const [query, setQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    setSearchTerm(query.trim().toLowerCase())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const filteredGrouped = useMemo(() => {
    if (!searchTerm) return grouped
    const result: Record<string, Reading[]> = {}
    for (const [group, items] of Object.entries(grouped)) {
      const filtered = items.filter((item) =>
        item.title.toLowerCase().includes(searchTerm),
      )
      if (filtered.length > 0) result[group] = filtered
    }
    return result
  }, [grouped, searchTerm])

  const groups = Object.entries(filteredGrouped)
  const totalFiltered = groups.reduce((sum, [, items]) => sum + items.length, 0)

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar lecturas..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 transition-all duration-150 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-600 dark:focus:ring-emerald-900"
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
          {totalFiltered} resultado{totalFiltered !== 1 ? "s" : ""} para &ldquo;{searchTerm}&rdquo;
        </p>
      )}

      {groups.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Image src="/reading.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {searchTerm ? "No se encontraron lecturas" : "No hay lecturas compartidas aún"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(([group, items]) => (
            <section key={group}>
              <h2 className="section-title mb-3">{group}</h2>
              <div className="space-y-3">
                {items.map((reading, i) => (
                  <Link
                    key={reading.id}
                    href={`/student/readings/${reading.id}`}
                    className="card card-hover animate-fade-in-up flex items-center gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
                    style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <Image src="/reading.svg" alt="" width={20} height={20} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-zinc-800 dark:text-zinc-100">
                        {reading.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                        {reading.text}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 flex-shrink-0 text-zinc-300 dark:text-zinc-600" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
