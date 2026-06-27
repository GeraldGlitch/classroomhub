"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Drama, Globe, ChevronRight } from "lucide-react"

export interface Roleplay {
  id: string
  title: string
  description: string | null
  topic_group: string | null
}

export default function RoleplaysList({
  grouped,
  counts,
}: {
  grouped: Record<string, Roleplay[]>
  counts: Record<string, number>
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
    const result: Record<string, Roleplay[]> = {}
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
            placeholder="Buscar roleplays..."
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
          {totalFiltered} resultado{totalFiltered !== 1 ? "s" : ""} para &ldquo;{searchTerm}&rdquo;
        </p>
      )}

      {groups.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Image src="/roleplays.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {searchTerm ? "No se encontraron roleplays" : "No hay roleplays compartidos aún"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(([group, items]) => (
            <section key={group}>
              <h2 className="mb-3 flex items-center gap-2.5 text-lg font-bold text-zinc-700 dark:text-zinc-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  <Globe className="h-5 w-5" />
                </span>
                {group}
              </h2>
              <div className="space-y-3">
                {items.map((roleplay, i) => (
                  <Link
                    key={roleplay.id}
                    href={`/student/roleplays/${roleplay.id}`}
                    className="card card-hover animate-fade-in-up flex items-center gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
                    style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                      <Drama className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-zinc-800 dark:text-zinc-100">
                        {roleplay.title}
                      </h3>
                      {roleplay.description && (
                        <p className="mt-0.5 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                          {roleplay.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                        {counts[roleplay.id] ?? 0} líneas
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
