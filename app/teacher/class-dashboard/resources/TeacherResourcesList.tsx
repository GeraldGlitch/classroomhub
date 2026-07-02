"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ArrowUpDown, FileText, Presentation, Video, Globe, ExternalLink, Pencil, BookOpen } from "lucide-react"
import DeleteResourceButton from "./DeleteResourceButton"

interface ResourceLink {
  label: string
  url: string
}

interface Resource {
  id: string
  title: string
  description: string | null
  resource_type: string | null
  external_links: ResourceLink[]
  topic_group: string | null
  created_at: string
}

const ITEMS_PER_PAGE = 15

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

const TYPE_COLORS: Record<string, string> = {
  DOC: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  SLIDE: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  VIDEO: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
}

function linkIcon(url: string) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return Video
  return Globe
}

export default function TeacherResourcesList({
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
            {searchTerm || activeType || dateSort ? "No se encontraron recursos" : "No hay recursos aún"}
          </p>
        </div>
      ) : dateSort ? (
        <FlatResourceList resources={filteredAndSorted} />
      ) : (
        <GroupedResourceList grouped={grouped} searchTerm={searchTerm} activeType={activeType} />
      )}
    </>
  )
}

function GroupedResourceList({
  grouped,
  searchTerm,
  activeType,
}: {
  grouped: Record<string, Resource[]>
  searchTerm: string
  activeType: string | null
}) {
  const groups = Object.entries(grouped)

  return (
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
          <ResourceGroupSection key={group} group={group} items={filtered} />
        )
      })}
    </div>
  )
}

function ResourceGroupSection({ group, items }: { group: string; items: Resource[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  const paginatedItems = items.slice(start, end)

  return (
    <section>
      <h2 className="section-title mb-3">
        <span className="section-title-icon">
          <Globe className="h-5 w-5" />
        </span>
        {group}
      </h2>
      <div className="space-y-3">
        {paginatedItems.map((resource, i) => (
          <ResourceRow key={resource.id} resource={resource} index={i} />
        ))}
      </div>
      {items.length > ITEMS_PER_PAGE && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {start + 1}–{Math.min(end, items.length)} de {items.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="press-bouncy rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="press-bouncy rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function FlatResourceList({ resources }: { resources: Resource[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(resources.length / ITEMS_PER_PAGE)
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  const paginatedItems = resources.slice(start, end)

  return (
    <div className="space-y-3">
      {paginatedItems.map((resource, i) => (
        <ResourceRow key={resource.id} resource={resource} index={i} />
      ))}
      {resources.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {start + 1}–{Math.min(end, resources.length)} de {resources.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="press-bouncy rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="press-bouncy rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ResourceRow({ resource, index }: { resource: Resource; index: number }) {
  const TypeIcon = resource.resource_type ? { DOC: FileText, SLIDE: Presentation, VIDEO: Video }[resource.resource_type] : null
  const typeColor = resource.resource_type ? TYPE_COLORS[resource.resource_type] : ""

  return (
    <div
      className="card card-hover animate-fade-in-up p-4"
      style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {resource.resource_type && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${typeColor}`}>
                {resource.resource_type}
              </span>
            )}
            <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{resource.title}</h3>
          </div>
          {resource.description && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{resource.description}</p>
          )}
          {resource.external_links && resource.external_links.length > 0 && (() => {
            const link = resource.external_links[0]
            const Icon = linkIcon(link.url)
            return (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-all duration-150 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
              >
                <Icon className="h-4 w-4" />
                <span>Abrir enlace</span>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
              </a>
            )
          })()}
        </div>
        <div className="flex items-center gap-1 ml-3">
          <Link
            href={`/teacher/class-dashboard/resources/${resource.id}/edit`}
            aria-label="Editar recurso"
            className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
          >
            <Pencil className="h-5 w-5" />
          </Link>
          <DeleteResourceButton id={resource.id} />
        </div>
      </div>
    </div>
  )
}
