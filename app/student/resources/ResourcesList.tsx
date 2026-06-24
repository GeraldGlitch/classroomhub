"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import ResourceGroup, { type Resource } from "./ResourceGroup"

export default function ResourcesList({
  grouped,
}: {
  grouped: Record<string, Resource[]>
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
    const result: Record<string, Resource[]> = {}
    for (const [group, items] of Object.entries(grouped)) {
      const filtered = items.filter((item) =>
        item.title.toLowerCase().includes(searchTerm)
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
            placeholder="Buscar recursos..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-4 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-600 dark:focus:ring-indigo-900"
          />
        </div>
        <button
          onClick={handleSearch}
          className="rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {searchTerm && (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {totalFiltered} resultado{totalFiltered !== 1 ? "s" : ""} para &ldquo;{searchTerm}&rdquo;
        </p>
      )}

      {groups.length === 0 ? (
        <div className="flex animate-fade-in flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <Search className="h-10 w-10 animate-bounce-subtle text-zinc-300 dark:text-zinc-600" />
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {searchTerm ? "No se encontraron recursos" : "No hay recursos compartidos aún"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(([group, items]) => (
            <ResourceGroup key={group} group={group} items={items} />
          ))}
        </div>
      )}
    </>
  )
}
