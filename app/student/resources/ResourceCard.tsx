"use client"

import { ExternalLink, Video, Globe, FileText, Presentation } from "lucide-react"
import type { Resource } from "./ResourceGroup"

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

export default function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const TypeIcon = resource.resource_type ? TYPE_ICONS[resource.resource_type] : null
  const typeColor = resource.resource_type ? TYPE_COLORS[resource.resource_type] : ""

  return (
    <div
      className="panel-hud card-hover animate-fade-in-up p-4"
      style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}
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
}