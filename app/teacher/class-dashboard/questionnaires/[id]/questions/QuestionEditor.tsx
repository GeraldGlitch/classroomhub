"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/Toast"
import {
  addQuestion, updateQuestion, deleteQuestion,
  addOption, updateOption, deleteOption,
} from "./actions"
import { Plus, Trash2, Pencil, Check, X, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  question_text: string
  question_type: string
  sort_order: number
}

interface Option {
  id: string
  option_text: string
  is_correct: boolean
  sort_order: number
}

export default function QuestionEditor({
  questionnaireId,
  published,
  questions: initialQuestions,
  optionsByQuestion: initialOptions,
}: {
  questionnaireId: string
  published: boolean
  questions: Question[]
  optionsByQuestion: Record<string, Option[]>
}) {
  const router = useRouter()
  const { show } = useToast()

  const [questions, setQuestions] = useState(initialQuestions)
  const [optionsByQuestion, setOptionsByQuestion] = useState(initialOptions)
  const [newQuestionText, setNewQuestionText] = useState("")
  const [newQuestionType, setNewQuestionType] = useState<"single" | "multiple">("single")
  const [addingQuestion, setAddingQuestion] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [editType, setEditType] = useState<"single" | "multiple">("single")
  const [addingOptionFor, setAddingOptionFor] = useState<string | null>(null)
  const [newOptionText, setNewOptionText] = useState("")
  const [newOptionCorrect, setNewOptionCorrect] = useState(false)
  const [editingOption, setEditingOption] = useState<string | null>(null)
  const [editOptionText, setEditOptionText] = useState("")
  const [editOptionCorrect, setEditOptionCorrect] = useState(false)

  const refresh = useCallback(() => {
    router.refresh()
  }, [router])

  const handleAddQuestion = async () => {
    if (!newQuestionText.trim()) return
    const formData = new FormData()
    formData.set("questionnaire_id", questionnaireId)
    formData.set("question_text", newQuestionText)
    formData.set("question_type", newQuestionType)
    const result = await addQuestion(formData)
    if (result?.error) {
      show(result.error, "error")
    } else {
      show("Pregunta añadida")
      setNewQuestionText("")
      setAddingQuestion(false)
      refresh()
    }
  }

  const handleUpdateQuestion = async (id: string) => {
    if (!editText.trim()) return
    const formData = new FormData()
    formData.set("id", id)
    formData.set("questionnaire_id", questionnaireId)
    formData.set("question_text", editText)
    formData.set("question_type", editType)
    const result = await updateQuestion(formData)
    if (result?.error) {
      show(result.error, "error")
    } else {
      show("Pregunta actualizada")
      setEditingQuestion(null)
      refresh()
    }
  }

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("¿Eliminar esta pregunta?")) return
    const formData = new FormData()
    formData.set("id", id)
    formData.set("questionnaire_id", questionnaireId)
    const result = await deleteQuestion(formData)
    if (result?.error) {
      show(result.error, "error")
    } else {
      show("Pregunta eliminada")
      refresh()
    }
  }

  const handleAddOption = async (questionId: string) => {
    if (!newOptionText.trim()) return
    const formData = new FormData()
    formData.set("question_id", questionId)
    formData.set("option_text", newOptionText)
    formData.set("is_correct", newOptionCorrect ? "on" : "off")
    const result = await addOption(formData)
    if (result?.error) {
      show(result.error, "error")
    } else {
      show("Opción añadida")
      setNewOptionText("")
      setNewOptionCorrect(false)
      setAddingOptionFor(null)
      refresh()
    }
  }

  const handleUpdateOption = async (id: string) => {
    if (!editOptionText.trim()) return
    const formData = new FormData()
    formData.set("id", id)
    formData.set("option_text", editOptionText)
    formData.set("is_correct", editOptionCorrect ? "on" : "off")
    const result = await updateOption(formData)
    if (result?.error) {
      show(result.error, "error")
    } else {
      show("Opción actualizada")
      setEditingOption(null)
      refresh()
    }
  }

  const handleDeleteOption = async (id: string) => {
    if (!confirm("¿Eliminar esta opción?")) return
    const formData = new FormData()
    formData.set("id", id)
    const result = await deleteOption(formData)
    if (result?.error) {
      show(result.error, "error")
    } else {
      show("Opción eliminada")
      refresh()
    }
  }

  const startEditQuestion = (q: Question) => {
    setEditingQuestion(q.id)
    setEditText(q.question_text)
    setEditType(q.question_type as "single" | "multiple")
  }

  const startEditOption = (o: Option) => {
    setEditingOption(o.id)
    setEditOptionText(o.option_text)
    setEditOptionCorrect(o.is_correct)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="section-title">
          <span className="section-title-icon">
            <Plus className="h-5 w-5" />
          </span>
          Preguntas ({questions.length})
        </h2>

        <div className="flex items-center gap-2">
          {!published && (
            <button
              onClick={() => setAddingQuestion(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Añadir pregunta
            </button>
          )}
          <Link
            href={`/teacher/class-dashboard/questionnaires/${questionnaireId}/reporting`}
            className="btn-secondary flex items-center gap-2"
          >
            Ver reportes
          </Link>
        </div>
      </div>

      {addingQuestion && (
        <div className="card p-4 space-y-3 animate-fade-in">
          <div>
            <label className="label-field">Pregunta</label>
            <input
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              className="input-field mt-1"
              placeholder="Escribe la pregunta..."
              autoFocus
            />
          </div>
          <div>
            <label className="label-field">Tipo</label>
            <select
              value={newQuestionType}
              onChange={(e) => setNewQuestionType(e.target.value as "single" | "multiple")}
              className="input-field mt-1 w-48"
            >
              <option value="single">Opción única</option>
              <option value="multiple">Opción múltiple</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddQuestion} className="btn-primary">
              Añadir
            </button>
            <button onClick={() => { setAddingQuestion(false); setNewQuestionText("") }} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {questions.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon">
            <Plus className="h-7 w-7" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No hay preguntas aún</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, qIdx) => {
            const options = optionsByQuestion[q.id] ?? []
            return (
              <div key={q.id} className="card p-4 animate-fade-in-up space-y-3" style={{ animationDelay: `${qIdx * 50}ms` }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {editingQuestion === q.id ? (
                      <div className="space-y-2">
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="input-field"
                          autoFocus
                        />
                        <select
                          value={editType}
                          onChange={(e) => setEditType(e.target.value as "single" | "multiple")}
                          className="input-field w-48"
                        >
                          <option value="single">Opción única</option>
                          <option value="multiple">Opción múltiple</option>
                        </select>
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateQuestion(q.id)} className="btn-primary text-sm py-1.5 px-3">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={() => setEditingQuestion(null)} className="btn-secondary text-sm py-1.5 px-3">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">
                          #{q.sort_order}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${q.question_type === "single" ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400"}`}>
                          {q.question_type === "single" ? "Única" : "Múltiple"}
                        </span>
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{q.question_text}</h3>
                      </div>
                    )}
                  </div>
                  {editingQuestion !== q.id && !published && (
                    <div className="flex items-center gap-1 ml-3">
                      <button
                        onClick={() => startEditQuestion(q)}
                        aria-label="Editar pregunta"
                        className="press-bouncy rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        aria-label="Eliminar pregunta"
                        className="press-bouncy rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 active:scale-90 dark:text-zinc-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="ml-4 space-y-2">
                  {options.map((o) => (
                    <div key={o.id} className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800">
                      {editingOption === o.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            value={editOptionText}
                            onChange={(e) => setEditOptionText(e.target.value)}
                            className="input-field flex-1"
                            autoFocus
                          />
                          <label className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={editOptionCorrect}
                              onChange={(e) => setEditOptionCorrect(e.target.checked)}
                              className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            Correcta
                          </label>
                          <button onClick={() => handleUpdateOption(o.id)} className="press-bouncy rounded-lg p-1.5 text-green-600 hover:bg-green-50 active:scale-90 dark:text-green-400 dark:hover:bg-green-950">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={() => setEditingOption(null)} className="press-bouncy rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 active:scale-90 dark:hover:bg-zinc-700">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            {o.is_correct ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
                            )}
                            <span className={`text-sm ${o.is_correct ? "font-semibold text-green-700 dark:text-green-400" : "text-zinc-600 dark:text-zinc-300"}`}>
                              {o.option_text}
                            </span>
                          </div>
                          {!published && (
                            <div className="flex items-center gap-1">
                              <button onClick={() => startEditOption(o)} aria-label="Editar opción" className="press-bouncy rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-zinc-700">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => handleDeleteOption(o.id)} aria-label="Eliminar opción" className="press-bouncy rounded-lg p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 active:scale-90 dark:text-zinc-500 dark:hover:bg-red-950">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}

                  {addingOptionFor === q.id ? (
                    <div className="flex items-center gap-2 animate-fade-in">
                      <input
                        value={newOptionText}
                        onChange={(e) => setNewOptionText(e.target.value)}
                        className="input-field flex-1"
                        placeholder="Texto de la opción..."
                        autoFocus
                      />
                      <label className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={newOptionCorrect}
                          onChange={(e) => setNewOptionCorrect(e.target.checked)}
                          className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        Correcta
                      </label>
                      <button onClick={() => handleAddOption(q.id)} className="press-bouncy rounded-lg p-2 text-green-600 hover:bg-green-50 active:scale-90 dark:text-green-400 dark:hover:bg-green-950">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => { setAddingOptionFor(null); setNewOptionText(""); setNewOptionCorrect(false) }} className="press-bouncy rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 active:scale-90 dark:hover:bg-zinc-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : !published && (
                    <button
                      onClick={() => setAddingOptionFor(q.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Añadir opción
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {published && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
          Este cuestionario está publicado. Las preguntas y opciones no se pueden modificar mientras esté publicado. Archívalo para editarlo.
        </div>
      )}
    </div>
  )
}
