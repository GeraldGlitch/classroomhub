"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, Send, HelpCircle } from "lucide-react"
import { useToast } from "@/components/Toast"
import { checkAnswer, submitAttempt } from "../actions"

interface Question {
  id: string
  question_text: string
  question_type: string
  sort_order: number
}

interface Option {
  id: string
  option_text: string
  sort_order: number
}

interface CheckResult {
  isCorrect: boolean
  correctOptionIds: string[]
}

export default function QuizPlayer({
  questionnaireId,
  attemptId,
  questionnaireTitle,
  questions,
  optionsByQuestion,
}: {
  questionnaireId: string
  attemptId: string
  questionnaireTitle: string
  questions: Question[]
  optionsByQuestion: Record<string, Option[]>
}) {
  const router = useRouter()
  const { show } = useToast()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, CheckResult>>({})
  const [checkingId, setCheckingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const currentQuestion = questions[currentIndex]
  const currentOptions = currentQuestion ? optionsByQuestion[currentQuestion.id] ?? [] : []
  const isLastQuestion = currentIndex === questions.length - 1
  const isCurrentChecked = currentQuestion ? checkedQuestions[currentQuestion.id] : undefined
  const hasSelection = currentQuestion ? (selections[currentQuestion.id]?.length ?? 0) > 0 : false
  const allChecked = questions.every((q) => checkedQuestions[q.id])
  const answeredCount = Object.keys(checkedQuestions).length

  const handleSelect = useCallback((optionId: string) => {
    if (isCurrentChecked) return // Can't change after checking

    setSelections((prev) => {
      if (currentQuestion.question_type === "single") {
        return { ...prev, [currentQuestion.id]: [optionId] }
      }
      const current = prev[currentQuestion.id] ?? []
      if (current.includes(optionId)) {
        return { ...prev, [currentQuestion.id]: current.filter((id) => id !== optionId) }
      }
      return { ...prev, [currentQuestion.id]: [...current, optionId] }
    })
  }, [currentQuestion, isCurrentChecked])

  const handleCheck = async () => {
    if (!hasSelection || !currentQuestion || checkingId) return

    setCheckingId(currentQuestion.id)
    const selectedIds = selections[currentQuestion.id] ?? []
    const result = await checkAnswer(currentQuestion.id, selectedIds)
    setCheckingId(null)

    if (result?.error) {
      show(result.error, "error")
      return
    }

    setCheckedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: { isCorrect: result.isCorrect ?? false, correctOptionIds: result.correctOptionIds ?? [] },
    }))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
    }
  }

  const handleSubmit = async () => {
    if (!allChecked) return
    setSubmitting(true)

    const answers = questions.map((q) => ({
      questionId: q.id,
      selectedOptionIds: selections[q.id] ?? [],
    }))

    const result = await submitAttempt(attemptId, answers)
    setSubmitting(false)

    if (result?.error) {
      show(result.error, "error")
      return
    }

    router.push(`/student/questionnaires/${questionnaireId}/result?attemptId=${attemptId}`)
  }

  if (!currentQuestion) return null

  const progressPercent = ((answeredCount) / questions.length) * 100

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header and progress */}
      <div className="card p-4 animate-fade-in-up">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-extrabold text-zinc-800 dark:text-zinc-100 truncate">
            {questionnaireTitle}
          </h1>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {answeredCount} / {questions.length}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card p-6 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
            {currentIndex + 1}
          </span>
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
            Pregunta {currentIndex + 1} de {questions.length}
          </span>
          <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${currentQuestion.question_type === "single" ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400"}`}>
            {currentQuestion.question_type === "single" ? "Única" : "Múltiple"}
          </span>
        </div>

        <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-4">
          {currentQuestion.question_text}
        </h2>

        <div className="space-y-2">
          {currentOptions.map((option) => {
            const selectedIds = selections[currentQuestion.id] ?? []
            const isSelected = selectedIds.includes(option.id)
            const result = isCurrentChecked
            const isCorrectOption = result?.correctOptionIds.includes(option.id)
            const isWrongSelection = isSelected && !isCorrectOption

            let bgClass = "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            if (result) {
              if (isCorrectOption) bgClass = "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950"
              else if (isWrongSelection) bgClass = "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950"
            }
            if (isSelected && !result) bgClass = "border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950"

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={!!isCurrentChecked}
                className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all active:scale-[0.98] disabled:cursor-default ${bgClass}`}
              >
                <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? "border-indigo-500 bg-indigo-500" : "border-zinc-300 dark:border-zinc-600"} ${result && isCorrectOption ? "border-green-500 bg-green-500" : ""} ${result && isWrongSelection ? "border-red-500 bg-red-500" : ""}`}>
                  {isSelected || (result && isCorrectOption) ? (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  ) : null}
                </span>
                <span className="flex-1">{option.option_text}</span>
                {result && isCorrectOption && (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                )}
                {result && isWrongSelection && (
                  <XCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Feedback bar */}
      {isCurrentChecked && (
        <div className={`animate-fade-in rounded-xl border px-4 py-3 ${isCurrentChecked.isCorrect ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"}`}>
          <p className={`flex items-center gap-2 text-sm font-bold ${isCurrentChecked.isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
            {isCurrentChecked.isCorrect ? (
              <><CheckCircle2 className="h-5 w-5" /> ¡Correcto!</>
            ) : (
              <><XCircle className="h-5 w-5" /> Incorrecto</>
            )}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="btn-secondary inline-flex items-center gap-1 disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
          Anterior
        </button>

        <div className="flex items-center gap-2">
          {!isCurrentChecked ? (
            <button
              onClick={handleCheck}
              disabled={!hasSelection || !!checkingId}
              className="btn-primary inline-flex items-center gap-2"
            >
              <HelpCircle className="h-5 w-5" />
              {checkingId === currentQuestion.id ? "Verificando..." : "Verificar"}
            </button>
          ) : isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!allChecked || submitting}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Send className="h-5 w-5" />
              {submitting ? "Entregando..." : "Entregar"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary inline-flex items-center gap-2"
            >
              Siguiente
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
