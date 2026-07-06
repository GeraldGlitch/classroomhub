"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Pencil, Copy, Trash2, CheckCircle2, Archive, ClipboardList, Eye } from "lucide-react"
import { useToast } from "@/components/Toast"
import { deleteQuestionnaire, duplicateQuestionnaire, publishQuestionnaire, archiveQuestionnaire } from "./actions"

interface Questionnaire {
  id: string
  title: string
  description: string | null
  topic_group: string | null
  published: boolean
  cooldown_minutes: number | null
  created_at: string
}

const ITEMS_PER_PAGE = 15

export default function QuestionnaireList({
  grouped,
  allQuestionnaires,
  questionCounts,
}: {
  grouped: Record<string, Questionnaire[]>
  allQuestionnaires: Questionnaire[]
  questionCounts: Record<string, number>
}) {
  const [query, setQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const { show } = useToast()

  const handleSearch = () => {
    setSearchTerm(query.trim().toLowerCase())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const filteredAndSorted = useMemo(() => {
    let filtered = allQuestionnaires
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm)
      )
    }
    return filtered
  }, [allQuestionnaires, searchTerm])

  const handleDelete = async (formData: FormData) => {
    const result = await deleteQuestionnaire(formData)
    if (result?.error) show(result.error, "error")
    else show("Cuestionario eliminado")
  }

  const handleDuplicate = async (id: string) => {
    const result = await duplicateQuestionnaire(id)
    if (result?.error) show(result.error, "error")
    else show("Cuestionario duplicado")
  }

  const handlePublish = async (formData: FormData) => {
    const result = await publishQuestionnaire(formData)
    if (result?.error) show(result.error, "error")
    else show("Cuestionario publicado")
  }

  const handleArchive = async (formData: FormData) => {
    const result = await archiveQuestionnaire(formData)
    if (result?.error) show(result.error, "error")
    else show("Cuestionario archivado")
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar cuestionarios..."
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

      {searchTerm && (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {filteredAndSorted.length} resultado{filteredAndSorted.length !== 1 ? "s" : ""} para &ldquo;{searchTerm}&rdquo;
        </p>
      )}

      {filteredAndSorted.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Image src="/questionnaries.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {searchTerm ? "No se encontraron cuestionarios" : "No hay cuestionarios aún"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([group, items]) => {
            let filtered = items
            if (searchTerm) {
              filtered = filtered.filter((item) =>
                item.title.toLowerCase().includes(searchTerm)
              )
            }
            if (filtered.length === 0) return null
            return (
              <section key={group}>
                <h2 className="section-title mb-3">
                  <span className="section-title-icon">
                    <ClipboardList className="h-5 w-5" />
                  </span>
                  {group}
                </h2>
                <div className="space-y-3">
                  {filtered.map((q, i) => (
                    <QuestionnaireCard
                      key={q.id}
                      questionnaire={q}
                      questionCount={questionCounts[q.id] ?? 0}
                      index={i}
                      onDelete={handleDelete}
                      onDuplicate={handleDuplicate}
                      onPublish={handlePublish}
                      onArchive={handleArchive}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </>
  )
}

function QuestionnaireCard({
  questionnaire,
  questionCount,
  index,
  onDelete,
  onDuplicate,
  onPublish,
  onArchive,
}: {
  questionnaire: Questionnaire
  questionCount: number
  index: number
  onDelete: (formData: FormData) => Promise<void>
  onDuplicate: (id: string) => Promise<void>
  onPublish: (formData: FormData) => Promise<void>
  onArchive: (formData: FormData) => Promise<void>
}) {
  return (
    <div
      className="card card-hover animate-fade-in-up p-4"
      style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {questionnaire.published ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:bg-green-950 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                Publicado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                Borrador
              </span>
            )}
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              {questionCount} pregunta{questionCount !== 1 ? "s" : ""}
            </span>
          </div>
          <h3 className="mt-1 font-bold text-zinc-800 dark:text-zinc-100 truncate">
            {questionnaire.title}
          </h3>
          {questionnaire.description && (
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {questionnaire.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-3 flex-shrink-0">
          <Link
            href={`/teacher/class-dashboard/questionnaires/${questionnaire.id}/questions`}
            aria-label="Editar preguntas"
            className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
          >
            <Eye className="h-5 w-5" />
          </Link>
          <Link
            href={`/teacher/class-dashboard/questionnaires/${questionnaire.id}/edit`}
            aria-label="Editar cuestionario"
            className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
          >
            <Pencil className="h-5 w-5" />
          </Link>
          <button
            onClick={() => onDuplicate(questionnaire.id)}
            aria-label="Duplicar cuestionario"
            className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
          >
            <Copy className="h-5 w-5" />
          </button>
          {!questionnaire.published ? (
            <form action={onPublish}>
              <input type="hidden" name="id" value={questionnaire.id} />
              <button
                type="submit"
                aria-label="Publicar cuestionario"
                className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-green-50 hover:text-green-500 active:scale-90 dark:text-zinc-500 dark:hover:bg-green-950 dark:hover:text-green-400"
              >
                <CheckCircle2 className="h-5 w-5" />
              </button>
            </form>
          ) : (
            <form action={onArchive}>
              <input type="hidden" name="id" value={questionnaire.id} />
              <button
                type="submit"
                aria-label="Archivar cuestionario"
                className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-amber-50 hover:text-amber-500 active:scale-90 dark:text-zinc-500 dark:hover:bg-amber-950 dark:hover:text-amber-400"
              >
                <Archive className="h-5 w-5" />
              </button>
            </form>
          )}
          <form action={onDelete}>
            <input type="hidden" name="id" value={questionnaire.id} />
            <button
              type="submit"
              aria-label="Eliminar cuestionario"
              className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-500 active:scale-90 dark:text-zinc-500 dark:hover:bg-red-950 dark:hover:text-red-400"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
