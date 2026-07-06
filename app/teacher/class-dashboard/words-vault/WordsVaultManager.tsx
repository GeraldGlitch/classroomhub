"use client"

import { useActionState, useState, useEffect, useRef, useMemo } from "react"
import { addVaultWord, updateVaultWord, deleteVaultWord } from "./actions"
import { Plus, Pencil, Trash2, X, Check, BookMarked, ChevronLeft, ChevronRight, Search } from "lucide-react"
import SpeakButton from "@/components/SpeakButton"
import { useToast } from "@/components/Toast"

interface VaultWord {
  id: string
  word: string
  pronunciation: string | null
  meaning: string | null
}

const ITEMS_PER_PAGE = 15

export default function WordsVaultManager({ words }: { words: VaultWord[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [word, setWord] = useState("")
  const [pronunciation, setPronunciation] = useState("")
  const [meaning, setMeaning] = useState("")
  const [query, setQuery] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    setSearchTerm(query.trim().toLowerCase())
    setPage(1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const filtered = useMemo(() => {
    if (!searchTerm) return words
    return words.filter((w) =>
      w.word.toLowerCase().includes(searchTerm),
    )
  }, [words, searchTerm])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  const paginatedWords = filtered.slice(start, end)

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages)
  }, [filtered.length, page, totalPages])

  const [addState, addAction, addPending] = useActionState(
    async (_prev: unknown, formData: FormData) => addVaultWord(formData),
    undefined,
  )

  const [updateState, updateAction, updatePending] = useActionState(
    async (_prev: unknown, formData: FormData) => updateVaultWord(formData),
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
    setShowForm(false)
    setEditingId(null)
  }

  function startEdit(w: VaultWord) {
    setEditingId(w.id)
    setWord(w.word)
    setPronunciation(w.pronunciation ?? "")
    setMeaning(w.meaning ?? "")
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
          <div className="grid gap-3 sm:grid-cols-3">
            <input name="word" placeholder="Palabra" required className="input-field" />
            <input name="pronunciation" placeholder="Pronunciación" className="input-field" />
            <input name="meaning" placeholder="Significado" className="input-field" />
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

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar palabras..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 transition-all duration-150 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-600 dark:focus:ring-indigo-900"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
        </div>
        <button
          onClick={handleSearch}
          className="press-bouncy rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700 active:scale-90 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          aria-label="Buscar"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {searchTerm && (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para &ldquo;{searchTerm}&rdquo;
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <BookMarked className="h-10 w-10" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {searchTerm ? "No se encontraron palabras" : "No hay palabras en la bóveda"}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="hidden sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400 dark:text-zinc-500">Palabra</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400 dark:text-zinc-500">Pronunciación</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400 dark:text-zinc-500">Significado</th>
                  <th className="w-24 px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {paginatedWords.map((w) => (
                  <tr key={w.id} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                    {editingId === w.id ? (
                      <td colSpan={4} className="p-3">
                        <form action={updateAction} className="space-y-3">
                          <input type="hidden" name="id" value={w.id} />
                          <div className="grid gap-3 sm:grid-cols-3">
                            <input name="word" value={word} onChange={(e) => setWord(e.target.value)} required className="input-field" />
                            <input name="pronunciation" value={pronunciation} onChange={(e) => setPronunciation(e.target.value)} className="input-field" />
                            <input name="meaning" value={meaning} onChange={(e) => setMeaning(e.target.value)} className="input-field" />
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
                      </td>
                    ) : (
                      <>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-zinc-800 dark:text-zinc-100">{w.word}</span>
                            <SpeakButton word={w.word} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">{w.pronunciation ?? "—"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">{w.meaning ?? "—"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => startEdit(w)} aria-label="Editar palabra" className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400">
                              <Pencil className="h-5 w-5" />
                            </button>
                            <DeleteVaultWordButton id={w.id} />
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-2.5">
            {paginatedWords.map((w) => (
              <div key={w.id} className="card card-hover group p-4">
                {editingId === w.id ? (
                  <form action={updateAction} className="space-y-3">
                    <input type="hidden" name="id" value={w.id} />
                    <div className="grid gap-3">
                      <input name="word" value={word} onChange={(e) => setWord(e.target.value)} required className="input-field" />
                      <input name="pronunciation" value={pronunciation} onChange={(e) => setPronunciation(e.target.value)} className="input-field" />
                      <input name="meaning" value={meaning} onChange={(e) => setMeaning(e.target.value)} className="input-field" />
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
                    <div className="space-y-2 flex-1">
                      <div>
                        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">Palabra</span>
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-zinc-800 dark:text-zinc-100">{w.word}</p>
                          <SpeakButton word={w.word} />
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">Pronunciación</span>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{w.pronunciation ?? "—"}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">Significado</span>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{w.meaning ?? "—"}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button onClick={() => startEdit(w)} aria-label="Editar palabra" className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400">
                        <Pencil className="h-5 w-5" />
                      </button>
                      <DeleteVaultWordButton id={w.id} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {start + 1}–{Math.min(end, filtered.length)} de {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="press-bouncy rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
                  {page} / {totalPages}
                </span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="press-bouncy rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DeleteVaultWordButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const [state, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => deleteVaultWord(formData),
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
          <button type="submit" disabled={pending} className="text-xs font-bold text-red-600 hover:text-red-800 active:scale-90 dark:text-red-400" aria-label="Confirmar eliminación">
            {pending ? "..." : "Sí"}
          </button>
        </form>
        <button onClick={() => setConfirming(false)} className="text-xs font-medium text-zinc-500 hover:text-zinc-700 active:scale-90 dark:text-zinc-400 dark:hover:text-zinc-300" aria-label="Cancelar eliminación">
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
