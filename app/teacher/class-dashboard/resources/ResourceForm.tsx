"use client"

import { useActionState, useState } from "react"
import { createResource, updateResource } from "./actions"
import { Plus, X } from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string | null
  topic_group: string | null
  external_links: { label: string; url: string }[]
}

export default function ResourceForm({ resource }: { resource?: Resource }) {
  const action = resource ? updateResource : createResource
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => action(formData),
    undefined,
  )

  const [links, setLinks] = useState<{ label: string; url: string }[]>(
    resource?.external_links ?? [],
  )
  const [linkLabel, setLinkLabel] = useState("")
  const [linkUrl, setLinkUrl] = useState("")

  function addLink() {
    if (!linkUrl) return
    setLinks([...links, { label: linkLabel || linkUrl, url: linkUrl }])
    setLinkLabel("")
    setLinkUrl("")
  }

  function removeLink(i: number) {
    setLinks(links.filter((_, idx) => idx !== i))
  }

  return (
    <form action={formAction} className="space-y-4">
      {resource && <input type="hidden" name="id" value={resource.id} />}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={resource?.title}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={resource?.description ?? ""}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="topic_group" className="block text-sm font-medium text-zinc-700">
          Grupo / Tema
        </label>
        <input
          id="topic_group"
          name="topic_group"
          defaultValue={resource?.topic_group ?? ""}
          placeholder="Ej: Gramática, Vocabulario..."
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Enlaces externos</label>
        <div className="mt-1 space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm">
              <span className="flex-1 text-zinc-700">{link.label}</span>
              <span className="text-xs text-zinc-400">{link.url}</span>
              <button type="button" onClick={() => removeLink(i)} className="text-zinc-400 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              placeholder="Nombre (opcional)"
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              className="block w-1/3 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="block flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={addLink}
              className="rounded-lg bg-zinc-100 px-3 text-zinc-600 hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <input type="hidden" name="external_links" value={JSON.stringify(links)} />
      </div>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? "Guardando..." : resource ? "Guardar cambios" : "Crear recurso"}
        </button>
      </div>
    </form>
  )
}
