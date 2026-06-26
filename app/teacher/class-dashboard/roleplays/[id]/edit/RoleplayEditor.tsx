"use client"

import { useActionState, useState, useEffect, useRef } from "react"
import { Plus, X, ArrowUp, ArrowDown, Trash2, Check, Drama } from "lucide-react"
import {
  updateRoleplay,
  addLine,
  updateLine,
  deleteLine,
  moveLineUp,
  moveLineDown,
} from "../../actions"
import { useToast } from "@/components/Toast"
import SpeakButton from "@/components/SpeakButton"

interface Roleplay {
  id: string
  title: string
  description: string | null
  topic_group: string | null
}

interface Line {
  id: string
  actor_name: string
  line_text: string
  line_order: number
}

export default function RoleplayEditor({
  roleplay,
  lines: initialLines,
}: {
  roleplay: Roleplay
  lines: Line[]
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => updateRoleplay(formData),
    undefined,
  )

  const { show } = useToast()
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (state && "error" in state && state.error) {
        show(state.error, "error")
      } else if (state && "success" in state && state.success) {
        show("Cambios guardados", "success")
      }
    }
    wasPending.current = pending
  }, [pending, state, show])

  return (
    <div className="space-y-6">
      <form action={formAction} className="card space-y-4 p-5">
        <input type="hidden" name="id" value={roleplay.id} />

        <div>
          <label htmlFor="title" className="label-field">
            Título
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={roleplay.title}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label htmlFor="description" className="label-field">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={roleplay.description ?? ""}
            className="input-field mt-1"
          />
        </div>

        <div>
          <label htmlFor="topic_group" className="label-field">
            Grupo / Tema
          </label>
          <input
            id="topic_group"
            name="topic_group"
            defaultValue={roleplay.topic_group ?? ""}
            placeholder="Ej: Gramática, Vocabulario..."
            className="input-field mt-1"
          />
        </div>

        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      <LinesManager roleplayId={roleplay.id} lines={initialLines} />
    </div>
  )
}

function LinesManager({ roleplayId, lines }: { roleplayId: string; lines: Line[] }) {
  return (
    <div className="card space-y-4 p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-500 dark:bg-purple-950 dark:text-purple-400">
          <Drama className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-300">
            Líneas del roleplay
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {lines.length} línea{lines.length !== 1 ? "s" : ""} en total
          </p>
        </div>
      </div>

      <AddLineForm roleplayId={roleplayId} />

      {lines.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          Aún no hay líneas. Añadí la primera arriba.
        </p>
      ) : (
        <div className="space-y-2.5">
          {lines.map((line, i) => (
            <LineRow
              key={line.id}
              line={line}
              roleplayId={roleplayId}
              isFirst={i === 0}
              isLast={i === lines.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function AddLineForm({ roleplayId }: { roleplayId: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => addLine(formData),
    undefined,
  )
  const { show } = useToast()
  const wasPending = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [actor, setActor] = useState("")
  const [text, setText] = useState("")

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (state?.error) {
        show(state.error, "error")
      } else {
        show("Línea añadida", "success")
        setActor("")
        setText("")
        formRef.current?.reset()
      }
    }
    wasPending.current = pending
  }, [pending, state, show])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60"
    >
      <input type="hidden" name="roleplay_id" value={roleplayId} />
      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700 dark:bg-purple-950 dark:text-purple-300">
          Actor
        </span>
        <input
          name="actor_name"
          value={actor}
          onChange={(e) => setActor(e.target.value)}
          placeholder="Nombre del actor"
          className="input-field flex-1"
        />
      </div>
      <textarea
        name="line_text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Texto de la línea"
        rows={2}
        className="input-field"
      />
      {state?.error && <p className="text-xs text-red-500 animate-fade-in">{state.error}</p>}
      <button
        type="submit"
        disabled={pending || !actor.trim() || !text.trim()}
        className="btn-primary text-xs"
      >
        <Plus className="mr-1 inline h-4 w-4" />
        {pending ? "Guardando..." : "Añadir línea"}
      </button>
    </form>
  )
}

function LineRow({
  line,
  roleplayId,
  isFirst,
  isLast,
}: {
  line: Line
  roleplayId: string
  isFirst: boolean
  isLast: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [actor, setActor] = useState(line.actor_name)
  const [text, setText] = useState(line.line_text)

  const [updateState, updateAction, updatePending] = useActionState(
    async (_prev: unknown, formData: FormData) => updateLine(formData),
    undefined,
  )
  const [deleteState, deleteAction, deletePending] = useActionState(
    async (_prev: unknown, formData: FormData) => deleteLine(formData),
    undefined,
  )

  const { show } = useToast()
  const wasUpdatePending = useRef(false)
  const wasDeletePending = useRef(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (wasUpdatePending.current && !updatePending) {
      if (updateState?.error) {
        show(updateState.error, "error")
      } else {
        show("Línea actualizada", "success")
        setEditing(false)
      }
    }
    wasUpdatePending.current = updatePending
  }, [updatePending, updateState, show])

  useEffect(() => {
    if (wasDeletePending.current && !deletePending) {
      if (deleteState?.error) {
        show(deleteState.error, "error")
        setConfirmDelete(false)
      } else {
        show("Línea eliminada", "success")
        setConfirmDelete(false)
      }
    }
    wasDeletePending.current = deletePending
  }, [deletePending, deleteState, show])

  useEffect(() => {
    if (!editing) {
      setActor(line.actor_name)
      setText(line.line_text)
    }
  }, [line.actor_name, line.line_text, editing])

  return (
    <div className="card group p-3">
      {editing ? (
        <form action={updateAction} className="space-y-2">
          <input type="hidden" name="id" value={line.id} />
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Actor
            </span>
            <input
              name="actor_name"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
              className="input-field flex-1"
            />
          </div>
          <textarea
            name="line_text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            className="input-field"
          />
          {updateState?.error && (
            <p className="text-xs text-red-500 animate-fade-in">{updateState.error}</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={updatePending || !actor.trim() || !text.trim()}
              aria-label="Guardar cambios"
              className="press-bouncy rounded-lg bg-indigo-600 px-3 py-1.5 text-white active:scale-90 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              aria-label="Cancelar"
              className="press-bouncy rounded-lg bg-zinc-100 px-3 py-1.5 text-zinc-600 active:scale-90 dark:bg-zinc-800 dark:text-zinc-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-start gap-3">
          <div className="flex flex-shrink-0 flex-col items-center gap-0.5 pt-1">
            <form action={moveLineUp}>
              <input type="hidden" name="id" value={line.id} />
              <button
                type="submit"
                disabled={isFirst}
                aria-label="Mover arriba"
                className="press-bouncy rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </form>
            <form action={moveLineDown}>
              <input type="hidden" name="id" value={line.id} />
              <button
                type="submit"
                disabled={isLast}
                aria-label="Mover abajo"
                className="press-bouncy rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </form>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              {line.actor_name}
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
              {line.line_text}
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-1">
            <SpeakButton word={line.line_text} />
            <button
              onClick={() => setEditing(true)}
              aria-label="Editar línea"
              className="press-bouncy rounded-lg p-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              Editar
            </button>
            {confirmDelete ? (
              <div className="flex animate-pop-in items-center gap-2 rounded-lg bg-red-50 px-2 py-1 dark:bg-red-950">
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">¿Eliminar?</span>
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={line.id} />
                  <button
                    type="submit"
                    disabled={deletePending}
                    aria-label="Confirmar eliminación"
                    className="text-xs font-bold text-red-600 hover:text-red-800 active:scale-90 dark:text-red-400"
                  >
                    {deletePending ? "..." : "Sí"}
                  </button>
                </form>
                <button
                  onClick={() => setConfirmDelete(false)}
                  aria-label="Cancelar eliminación"
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-700 active:scale-90 dark:text-zinc-400 dark:hover:text-zinc-300"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                aria-label="Eliminar línea"
                className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-500 active:scale-90 dark:hover:bg-red-950 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
      <span className="mt-1.5 inline-block rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
        #{line.line_order + 1}
      </span>
    </div>
  )
}
