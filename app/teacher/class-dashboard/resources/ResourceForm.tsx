"use client"

import { useActionState, useState } from "react"
import { createResource, updateResource } from "./actions"
import { FileText, Presentation, Video } from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string | null
  topic_group: string | null
  resource_type: string | null
  external_links: { label: string; url: string }[]
}

const RESOURCE_TYPES = [
  { value: "DOC", label: "DOC", icon: FileText },
  { value: "SLIDE", label: "SLIDE", icon: Presentation },
  { value: "VIDEO", label: "VIDEO", icon: Video },
]

function firstLink(resource?: Resource): string {
  const links = resource?.external_links
  if (!links || links.length === 0) return ""
  return links[0].url
}

export default function ResourceForm({ resource }: { resource?: Resource }) {
  const action = resource ? updateResource : createResource
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => action(formData),
    undefined,
  )
  const [selectedType, setSelectedType] = useState(resource?.resource_type ?? "DOC")

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </div>
      )}
      {resource && <input type="hidden" name="id" value={resource.id} />}

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Tipo de recurso
        </label>
        <div className="flex gap-2">
          {RESOURCE_TYPES.map((t) => {
            const Icon = t.icon
            const isActive = selectedType === t.value
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setSelectedType(t.value)}
                className={`press-bouncy flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
                  isActive
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700 shadow-sm dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            )
          })}
          <input type="hidden" name="resource_type" value={selectedType} />
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={resource?.title}
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={resource?.description ?? ""}
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
        />
      </div>

      <div>
        <label htmlFor="topic_group" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Grupo / Tema
        </label>
        <input
          id="topic_group"
          name="topic_group"
          defaultValue={resource?.topic_group ?? ""}
          placeholder="Ej: Gramática, Vocabulario..."
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
        />
      </div>

      <div>
        <label htmlFor="external_url" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Enlace externo
        </label>
        <input
          id="external_url"
          name="external_url"
          type="url"
          defaultValue={firstLink(resource)}
          placeholder="https://..."
          className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary"
        >
          {pending ? "Guardando..." : resource ? "Guardar cambios" : "Crear recurso"}
        </button>
      </div>
    </form>
  )
}
