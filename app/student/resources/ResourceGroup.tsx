"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink, Video, Globe, FileText, Presentation } from "lucide-react"

export interface ResourceLink {
  label: string
  url: string
}

export interface Resource {
  id: string
  title: string
  description: string | null
  resource_type: string | null
  external_links: ResourceLink[]
  created_at: string
}

const ITEMS_PER_PAGE = 10

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  DOC: FileText,
  SLIDE: Presentation,
  VIDEO: Video,
}

const TYPE_COLORS: Record<string, string> = {
  DOC: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  SLIDE: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  VIDEO: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
}

function getLinkIcon(url: string) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return Video
  return Globe
}

export default function ResourceGroup({ group, items }: { group: string; items: Resource[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)

  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  const paginatedItems = items.slice(start, end)

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2.5 text-lg font-bold text-zinc-700 dark:text-zinc-300">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          <Globe className="h-5 w-5" />
        </span>
        {group}
      </h2>
      <div className="space-y-3">
        {paginatedItems.map((resource, i) => {
          const TypeIcon = resource.resource_type ? TYPE_ICONS[resource.resource_type] : null
          const typeColor = resource.resource_type ? TYPE_COLORS[resource.resource_type] : ""
          return (
            <div
              key={resource.id}
              className="panel-hud card-hover animate-fade-in-up p-4"
              style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                {TypeIcon && (
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${typeColor}`}>
                    <TypeIcon className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{resource.title}</h3>
                    {resource.resource_type && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${typeColor}`}>
                        {resource.resource_type}
                      </span>
                    )}
                  </div>
                  {resource.description && (
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{resource.description}</p>
                  )}
                  {resource.external_links && resource.external_links.length > 0 && (() => {
                    const link = resource.external_links[0]
                    const Icon = getLinkIcon(link.url)
                    return (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-all duration-150 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
                      >
                        <Icon className="h-4 w-4" />
                        <span>Abrir enlace</span>
                        <ExternalLink className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
                      </a>
                    )
                  })()}
                </div>
              </div>
            </div>
          )
        })}
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
    </section>
  )
}