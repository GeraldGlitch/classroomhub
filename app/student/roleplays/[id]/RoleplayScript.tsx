"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import SpeakButton from "@/components/SpeakButton"

interface Line {
  id: string
  actor_name: string
  line_text: string
  line_order: number
}

const LINES_PER_PAGE = 10

function getActorColor(name: string) {
  const colors = [
    "indigo",
    "purple",
    "pink",
    "rose",
    "orange",
    "amber",
    "emerald",
    "teal",
    "sky",
    "blue",
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function colorClasses(color: string) {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    indigo: {
      bg: "bg-indigo-100 dark:bg-indigo-950",
      text: "text-indigo-700 dark:text-indigo-300",
      dot: "bg-indigo-500",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-950",
      text: "text-purple-700 dark:text-purple-300",
      dot: "bg-purple-500",
    },
    pink: {
      bg: "bg-pink-100 dark:bg-pink-950",
      text: "text-pink-700 dark:text-pink-300",
      dot: "bg-pink-500",
    },
    rose: {
      bg: "bg-rose-100 dark:bg-rose-950",
      text: "text-rose-700 dark:text-rose-300",
      dot: "bg-rose-500",
    },
    orange: {
      bg: "bg-orange-100 dark:bg-orange-950",
      text: "text-orange-700 dark:text-orange-300",
      dot: "bg-orange-500",
    },
    amber: {
      bg: "bg-amber-100 dark:bg-amber-950",
      text: "text-amber-700 dark:text-amber-300",
      dot: "bg-amber-500",
    },
    emerald: {
      bg: "bg-emerald-100 dark:bg-emerald-950",
      text: "text-emerald-700 dark:text-emerald-300",
      dot: "bg-emerald-500",
    },
    teal: {
      bg: "bg-teal-100 dark:bg-teal-950",
      text: "text-teal-700 dark:text-teal-300",
      dot: "bg-teal-500",
    },
    sky: {
      bg: "bg-sky-100 dark:bg-sky-950",
      text: "text-sky-700 dark:text-sky-300",
      dot: "bg-sky-500",
    },
    blue: {
      bg: "bg-blue-100 dark:bg-blue-950",
      text: "text-blue-700 dark:text-blue-300",
      dot: "bg-blue-500",
    },
  }
  return map[color] ?? map.indigo
}

export default function RoleplayScript({ lines }: { lines: Line[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(lines.length / LINES_PER_PAGE))

  const start = (page - 1) * LINES_PER_PAGE
  const end = start + LINES_PER_PAGE
  const paginatedLines = lines.slice(start, end)

  const actorMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const line of lines) {
      if (!map.has(line.actor_name)) {
        map.set(line.actor_name, getActorColor(line.actor_name))
      }
    }
    return map
  }, [lines])

  if (lines.length === 0) {
    return (
      <div className="empty-state animate-fade-in">
        <div className="empty-state-icon animate-bob">
          <Image src="/roleplays.svg" alt="" width={40} height={40} className="h-10 w-10" />
        </div>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Este roleplay aún no tiene líneas
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {actorMap.size > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Actores:
          </span>
          {Array.from(actorMap.entries()).map(([name, color]) => {
            const c = colorClasses(color)
            return (
              <span
                key={name}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${c.bg} ${c.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                {name}
              </span>
            )
          })}
        </div>
      )}

      <div className="space-y-3">
        {paginatedLines.map((line, i) => {
          const color = actorMap.get(line.actor_name) ?? "indigo"
          const c = colorClasses(color)
          return (
            <div
              key={line.id}
              className="card animate-fade-in-up p-4"
              style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${c.bg} ${c.text}`}
                >
                  {line.actor_name.charAt(0).toUpperCase()}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider ${c.text}`}>
                  {line.actor_name}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <SpeakButton word={line.line_text} />
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                    #{line.line_order + 1}
                  </span>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-base text-zinc-800 dark:text-zinc-100">
                {line.line_text}
              </p>
            </div>
          )
        })}
      </div>

      {lines.length > LINES_PER_PAGE && (
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {start + 1}–{Math.min(end, lines.length)} de {lines.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Página anterior"
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
              aria-label="Página siguiente"
              className="press-bouncy rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
