"use client"

import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, XCircle, ArrowLeft, Clock } from "lucide-react"

interface AnswerDetail {
  questionId: string
  questionText: string
  questionType: string
  selectedOptions: string[]
  isCorrect: boolean
  correctOptions: { id: string; option_text: string }[]
  selectedTexts: string[]
}

export default function ResultCard({
  score,
  totalQuestions,
  percentage,
  timeSpent,
  questionnaireId,
  answerDetails,
}: {
  score: number
  totalQuestions: number
  percentage: number
  timeSpent: number
  questionnaireId: string
  answerDetails: AnswerDetail[]
}) {
  const incorrect = totalQuestions - score
  const passed = percentage >= 60

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m} min ${s}s`
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/student/questionnaires/${questionnaireId}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al cuestionario
      </Link>

      {/* Score card */}
      <div className="card p-8 animate-scale-in text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950">
          <Image src="/questionnaries.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
        </div>

        <h1 className="mt-4 text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">
          {passed ? "¡Buen trabajo!" : "Sigue practicando"}
        </h1>

        <p className="mt-2 text-5xl font-extrabold tracking-tight">
          <span className={passed ? "text-green-500" : "text-red-500"}>
            {percentage}%
          </span>
        </p>

        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          {score} / {totalQuestions} correctas
        </p>

        {timeSpent > 0 && (
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500">
            <Clock className="h-4 w-4" />
            {formatTime(timeSpent)}
          </p>
        )}

        <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              passed
                ? "bg-gradient-to-r from-green-500 to-green-400"
                : "bg-gradient-to-r from-red-500 to-red-400"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-4 flex justify-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-green-500">{score}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Correctas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-red-500">{incorrect}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Incorrectas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-zinc-600 dark:text-zinc-300">{totalQuestions}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Total</p>
          </div>
        </div>
      </div>

      {/* Per-question review */}
      <div className="space-y-3">
        <h2 className="section-title">
          <span className="section-title-icon">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          Revisión de preguntas
        </h2>

        {answerDetails.map((detail, i) => (
          <div
            key={detail.questionId}
            className={`card animate-fade-in-up p-4 ${detail.isCorrect ? "" : "border-red-200 dark:border-red-800"}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {detail.isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-500">#{i + 1}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${detail.questionType === "single" ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400"}`}>
                    {detail.questionType === "single" ? "Única" : "Múltiple"}
                  </span>
                </div>
                <p className="mt-1 font-bold text-zinc-800 dark:text-zinc-100">{detail.questionText}</p>

                {detail.selectedTexts.length > 0 && (
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-300">Tu respuesta: </span>
                    {detail.selectedTexts.join(", ")}
                  </p>
                )}

                {!detail.isCorrect && detail.correctOptions.length > 0 && (
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                    <span className="font-semibold">Respuesta correcta: </span>
                    {detail.correctOptions.map((o) => o.option_text).join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pb-8">
        <Link
          href={`/student/questionnaires/${questionnaireId}`}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver al cuestionario
        </Link>
      </div>
    </div>
  )
}
