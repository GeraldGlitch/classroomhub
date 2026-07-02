"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Pencil, Globe } from "lucide-react"
import DeleteRoleplayButton from "./DeleteRoleplayButton"

interface Roleplay {
  id: string
  title: string
  description: string | null
  topic_group: string | null
}

export default function RoleplaysList({
  roleplays,
  counts,
}: {
  roleplays: Roleplay[]
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

  const filtered = useMemo(() => {
    if (!searchTerm) return roleplays
    return roleplays.filter((r) => r.title.toLowerCase().includes(searchTerm))
  }, [roleplays, searchTerm])

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, typeof filtered>>((acc, r) => {
      const key = r.topic_group ?? "Sin grupo"
      if (!acc[key]) acc[key] = []
      acc[key].push(r)
      return acc
    }, {})
  }, [filtered])

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
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 transition-all duration-150 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-purple-600 dark:focus:ring-purple-900"
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

      {Object.keys(grouped).length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Image src="/roleplays.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-600 dark:text-zinc-400">
            {searchTerm ? "No se encontraron roleplays" : "No hay roleplays aún"}
          </h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {searchTerm ? "Probá con otro término de búsqueda" : "Crea tu primer roleplay para compartir con la clase"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([group, items]) => (
            <section key={group}>
              <h2 className="section-title mb-3">
                <span className="section-title-icon">
                  <Globe className="h-5 w-5" />
                </span>
                {group}
              </h2>
              <div className="space-y-3">
                {items.map((roleplay, i) => (
                  <div
                    key={roleplay.id}
                    className="card card-hover animate-fade-in-up p-4"
                    style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/teacher/class-dashboard/roleplays/${roleplay.id}/edit`}
                        className="flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 rounded-lg"
                      >
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{roleplay.title}</h3>
                        {roleplay.description && (
                          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{roleplay.description}</p>
                        )}
                        <p className="mt-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                          {counts[roleplay.id] ?? 0} líneas
                        </p>
                      </Link>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/teacher/class-dashboard/roleplays/${roleplay.id}/edit`}
                          aria-label="Editar roleplay"
                          className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
                        >
                          <Pencil className="h-5 w-5" />
                        </Link>
                        <DeleteRoleplayButton id={roleplay.id} title={roleplay.title} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
