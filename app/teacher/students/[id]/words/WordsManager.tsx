"use client"

import { useActionState, useState } from "react"
import { addWord, updateWord, deleteWord } from "./actions"
import { Plus, Pencil, Trash2, X, Check } from "lucide-react"

interface Word {
  id: string
  word: string
  pronunciation: string | null
  meaning: string | null
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

  const [addState, addAction, addPending] = useActionState(
    async (_prev: unknown, formData: FormData) => addWord(formData),
    undefined,
  )

  const [updateState, updateAction, updatePending] = useActionState(
    async (_prev: unknown, formData: FormData) => updateWord(formData),
    undefined,
  )

  function resetForm() {
    setWord("")
    setPronunciation("")
    setMeaning("")
    setShowForm(false)
    setEditingId(null)
  }

  function startEdit(w: Word) {
    setEditingId(w.id)
    setWord(w.word)
    setPronunciation(w.pronunciation ?? "")
    setMeaning(w.meaning ?? "")
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        <Plus className="h-4 w-4" />
        Añadir palabra
      </button>

      {showForm && (
        <form action={addAction} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <input type="hidden" name="student_id" value={studentId} />
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              name="word"
              placeholder="Palabra"
              required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              name="pronunciation"
              placeholder="Pronunciación"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              name="meaning"
              placeholder="Significado"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {addState?.error && <p className="mt-2 text-sm text-red-500">{addState.error}</p>}
          <div className="mt-3 flex gap-2">
            <button type="submit" disabled={addPending} className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
              {addPending ? "..." : "Guardar"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {words.length === 0 && !showForm ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <p className="text-sm text-zinc-400">No hay palabras registradas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {words.map((w) => (
            <div key={w.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              {editingId === w.id ? (
                <form action={updateAction} className="space-y-3">
                  <input type="hidden" name="id" value={w.id} />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input
                      name="word"
                      value={word}
                      onChange={(e) => setWord(e.target.value)}
                      required
                      className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      name="pronunciation"
                      value={pronunciation}
                      onChange={(e) => setPronunciation(e.target.value)}
                      className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      name="meaning"
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                      className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  {updateState?.error && <p className="text-sm text-red-500">{updateState.error}</p>}
                  <div className="flex gap-2">
                    <button type="submit" disabled={updatePending} className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                      <Check className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={resetForm} className="rounded-lg bg-zinc-100 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-200">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="grid gap-1 sm:grid-cols-3 sm:gap-4">
                    <div>
                      <span className="text-xs text-zinc-400 sm:hidden">Palabra</span>
                      <p className="font-medium text-zinc-800">{w.word}</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 sm:hidden">Pronunciación</span>
                      <p className="text-sm text-zinc-600">{w.pronunciation ?? "—"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400 sm:hidden">Significado</span>
                      <p className="text-sm text-zinc-600">{w.meaning ?? "—"}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(w)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600">
                      <Pencil className="h-4 w-4" />
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
  const [, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => deleteWord(formData),
    undefined,
  )

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending} className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-500">
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  )
}
