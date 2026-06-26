"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink, Video, Globe } from "lucide-react"

export interface ResourceLink {
  label: string
  url: string
}

export interface Resource {
  id: string
  title: string
  description: string | null
  external_links: ResourceLink[]
}

const ITEMS_PER_PAGE = 10

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
        {paginatedItems.map((resource, i) => (
          <div
            key={resource.id}
            className="card card-hover animate-fade-in-up p-4"
            style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
          >
            <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{resource.title}</h3>
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
