"use client"

import { useActionState, useState, useEffect, useRef } from "react"
import { addWord, updateWord, deleteWord } from "./actions"
import { Plus, Pencil, Trash2, X, Check, BookMarked } from "lucide-react"
import SpeakButton from "@/components/SpeakButton"
import { useToast } from "@/components/Toast"

interface Word {
  id: string
  word: string
  pronunciation: string | null
  meaning: string | null
  fail_count: number
}

export default function WordsManager({
  studentId,
  words,
}: {
  studentId: string
  words: Word[]
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [word, setWord] = useState("")
  const [pronunciation, setPronunciation] = useState("")
  const [meaning, setMeaning] = useState("")
  const [failCount, setFailCount] = useState(1)

  const [addState, addAction, addPending] = useActionState(
    async (_prev: unknown, formData: FormData) => addWord(formData),
    undefined,
  )

  const [updateState, updateAction, updatePending] = useActionState(
    async (_prev: unknown, formData: FormData) => updateWord(formData),
    undefined,
  )

  const { show } = useToast()
  const wasAddPending = useRef(false)
  const wasUpdatePending = useRef(false)

  useEffect(() => {
    if (wasAddPending.current && !addPending) {
      if (addState?.error) show(addState.error, "error")
      else {
        show("Palabra añadida", "success")
        resetForm()
      }
    }
    wasAddPending.current = addPending
  }, [addPending, addState, show])

  useEffect(() => {
    if (wasUpdatePending.current && !updatePending) {
      if (updateState?.error) show(updateState.error, "error")
      else {
        show("Palabra actualizada", "success")
        resetForm()
      }
    }
    wasUpdatePending.current = updatePending
  }, [updatePending, updateState, show])

  function resetForm() {
    setWord("")
    setPronunciation("")
    setMeaning("")
    setFailCount(1)
    setShowForm(false)
    setEditingId(null)
  }

  function startEdit(w: Word) {
    setEditingId(w.id)
    setWord(w.word)
    setPronunciation(w.pronunciation ?? "")
    setMeaning(w.meaning ?? "")
    setFailCount(w.fail_count ?? 0)
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary flex items-center gap-2"
      >
        <Plus className="h-5 w-5" />
        Añadir palabra
      </button>

      {showForm && (
        <form action={addAction} className="card animate-fade-in-up p-4">
          <input type="hidden" name="student_id" value={studentId} />
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              name="word"
              placeholder="Palabra"
              required
              className="input-field"
            />
            <input
              name="pronunciation"
              placeholder="Pronunciación"
              className="input-field"
            />
            <input
              name="meaning"
              placeholder="Significado"
              className="input-field"
            />
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Veces fallada
            </label>
            <input
              name="fail_count"
              type="number"
              min="1"
              defaultValue={1}
              className="input-field w-full max-w-[160px]"
            />
          </div>
          {addState?.error && <p className="mt-2 text-sm text-red-500 animate-fade-in">{addState.error}</p>}
          <div className="mt-3 flex gap-2">
            <button type="submit" disabled={addPending} className="btn-primary text-xs">
              {addPending ? "..." : "Guardar"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-xl bg-zinc-100 px-4 py-2.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-200 active:scale-95 dark:bg-zinc-800 dark:text-zinc-400">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {words.length === 0 && !showForm ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <BookMarked className="h-10 w-10" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No hay palabras registradas</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {words.map((w) => (
            <div key={w.id} className="card card-hover group p-4">
              {editingId === w.id ? (
                <form action={updateAction} className="space-y-3">
                  <input type="hidden" name="id" value={w.id} />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      name="word"
                      value={word}
                      onChange={(e) => setWord(e.target.value)}
                      required
                      className="input-field"
                    />
                    <input
                      name="pronunciation"
                      value={pronunciation}
                      onChange={(e) => setPronunciation(e.target.value)}
                      className="input-field"
                    />
                    <input
                      name="meaning"
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      Veces fallada
                    </label>
                    <input
                      name="fail_count"
                      type="number"
                      min="1"
                      value={failCount}
                      onChange={(e) => setFailCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="input-field w-full max-w-[160px]"
                    />
                  </div>
                  {updateState?.error && <p className="text-sm text-red-500 animate-fade-in">{updateState.error}</p>}
                  <div className="flex gap-2">
                    <button type="submit" disabled={updatePending} className="press-bouncy rounded-lg bg-indigo-600 px-3 py-1.5 text-white active:scale-90 disabled:opacity-50">
                      <Check className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={resetForm} className="press-bouncy rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 text-zinc-600 dark:text-zinc-400 active:scale-90">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="grid gap-1 sm:grid-cols-4 sm:gap-4">
                    <div>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 sm:hidden">Palabra</span>
                      <p className="font-bold text-zinc-800 dark:text-zinc-100">{w.word}</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 sm:hidden">Pronunciación</span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{w.pronunciation ?? "—"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 sm:hidden">Significado</span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{w.meaning ?? "—"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 sm:hidden">Veces fallada</span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{w.fail_count ?? 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <SpeakButton word={w.word} />
                    <button
                      onClick={() => startEdit(w)}
                      aria-label="Editar palabra"
                      className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <DeleteWordButton id={w.id} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DeleteWordButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => deleteWord(formData),
    undefined,
  )
  const { show } = useToast()
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (state?.error) show(state.error, "error")
      else {
        show("Palabra eliminada", "success")
        setConfirming(false)
      }
    }
    wasPending.current = pending
  }, [pending, state, show])

  if (confirming) {
    return (
      <div className="flex animate-pop-in items-center gap-2 rounded-lg bg-red-50 px-2 py-1 dark:bg-red-950">
        <span className="text-xs font-semibold text-red-600 dark:text-red-400">¿Eliminar?</span>
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            disabled={pending}
            className="text-xs font-bold text-red-600 hover:text-red-800 active:scale-90 dark:text-red-400"
            aria-label="Confirmar eliminación"
          >
            {pending ? "..." : "Sí"}
          </button>
        </form>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs font-medium text-zinc-500 hover:text-zinc-700 active:scale-90 dark:text-zinc-400 dark:hover:text-zinc-300"
          aria-label="Cancelar eliminación"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-500 active:scale-90 dark:text-zinc-500 dark:hover:bg-red-950 dark:hover:text-red-400"
      aria-label="Eliminar palabra"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  )
}
