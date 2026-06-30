"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Search, FileText, Presentation, Video, Globe, ExternalLink, ArrowUpDown } from "lucide-react"
import ResourceGroup, { type Resource } from "./ResourceGroup"
import ResourceCard from "./ResourceCard"

const TYPE_FILTERS = [
  { value: "DOC", label: "DOC", icon: FileText },
  { value: "SLIDE", label: "SLIDE", icon: Presentation },
  { value: "VIDEO", label: "VIDEO", icon: Video },
]

const SORT_OPTIONS = [
  { value: "", label: "Agrupado" },
  { value: "recent", label: "Más recientes" },
  { value: "oldest", label: "Más antiguos" },
]

export default function ResourcesList({
  grouped,
  allResources,
}: {
  grouped: Record<string, Resource[]>
  allResources: Resource[]
}) {
  const [query, setQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeType, setActiveType] = useState<string | null>(null)
  const [dateSort, setDateSort] = useState("")

  const handleSearch = () => {
    setSearchTerm(query.trim().toLowerCase())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const filteredAndSorted = useMemo(() => {
    let filtered = allResources
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm)
      )
    }
    if (activeType) {
      filtered = filtered.filter((item) => item.resource_type === activeType)
    }
    if (dateSort === "recent") {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    } else if (dateSort === "oldest") {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    }
    return filtered
  }, [allResources, searchTerm, activeType, dateSort])

  const groups = Object.entries(grouped)
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

      <div className="flex flex-wrap items-center gap-2">
        {TYPE_FILTERS.map((t) => {
          const Icon = t.icon
          const isActive = activeType === t.value
          return (
            <button
              key={t.value}
              onClick={() => setActiveType(isActive ? null : t.value)}
              className={`press-bouncy flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                isActive
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                  : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          )
        })}

        <div className="ml-auto relative">
          <select
            value={dateSort}
            onChange={(e) => setDateSort(e.target.value)}
            className="appearance-none rounded-xl border border-zinc-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-zinc-600 transition-all hover:border-zinc-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:focus:border-indigo-600 dark:focus:ring-indigo-900"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
        </div>
      </div>

      {searchTerm && (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {filteredAndSorted.length} resultado{filteredAndSorted.length !== 1 ? "s" : ""} para &ldquo;{searchTerm}&rdquo;
        </p>
      )}

      {filteredAndSorted.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Image src="/recursos.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {searchTerm || activeType || dateSort ? "No se encontraron recursos" : "No hay recursos compartidos aún"}
          </p>
        </div>
      ) : dateSort ? (
        <div className="space-y-3">
          {filteredAndSorted.map((resource, i) => (
            <ResourceCard key={resource.id} resource={resource} index={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(([group, items]) => {
            let filtered = items
            if (searchTerm) {
              filtered = filtered.filter((item) =>
                item.title.toLowerCase().includes(searchTerm)
              )
            }
            if (activeType) {
              filtered = filtered.filter((item) => item.resource_type === activeType)
            }
            if (filtered.length === 0) return null
            return (
              <ResourceGroup key={group} group={group} items={filtered} />
            )
          })}
        </div>
      )}
    </>
  )
}