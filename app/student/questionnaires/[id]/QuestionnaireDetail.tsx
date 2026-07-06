"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Play, Timer } from "lucide-react"
import { useToast } from "@/components/Toast"
import { startAttempt } from "./actions"

interface Questionnaire {
  id: string
  title: string
  description: string | null
  instructions: string | null
  cooldown_minutes: number | null
  topic_group: string | null
}

interface Attempt {
  id: string
  started_at: string
  finished_at: string | null
  score: number | null
  total_questions: number | null
  percentage: number | null
}

export default function QuestionnaireDetail({
  questionnaire,
  questionCount,
  attempts,
  lastAttemptDate,
}: {
  questionnaire: Questionnaire
  questionCount: number
  attempts: Attempt[]
  lastAttemptDate: string | null
}) {
  const router = useRouter()
  const { show } = useToast()
  const [starting, setStarting] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  const calculateCooldown = useCallback(() => {
    if (!questionnaire.cooldown_minutes || !lastAttemptDate) return 0
    const cooldownMs = questionnaire.cooldown_minutes * 60 * 1000
    const elapsed = Date.now() - new Date(lastAttemptDate).getTime()
    const remaining = Math.max(0, Math.ceil((cooldownMs - elapsed) / 1000))
    return remaining
  }, [questionnaire.cooldown_minutes, lastAttemptDate])

  useEffect(() => {
    const remaining = calculateCooldown()
    setCooldownRemaining(remaining)
    if (remaining <= 0) return

    const interval = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [calculateCooldown])

  const handleStart = async () => {
    setStarting(true)
    const result = await startAttempt(questionnaire.id)
    if (result?.error) {
      show(result.error, "error")
      setStarting(false)
    } else if (result?.attemptId) {
      router.push(`/student/questionnaires/${questionnaire.id}/attempt?attemptId=${result.attemptId}`)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const canStart = cooldownRemaining <= 0

  return (
    <div className="space-y-6">
      <Link
        href="/student/questionnaires"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Link>

      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <Image src="/questionnaries.svg" alt="" width={36} height={36} className="h-9 w-9" />
        </div>
        <h1 className="page-title">{questionnaire.title}</h1>
      </div>

      <div className="card p-6 animate-fade-in-up space-y-4">
        {questionnaire.description && (
          <p className="text-zinc-600 dark:text-zinc-300">{questionnaire.description}</p>
        )}

        {questionnaire.instructions && (
          <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950">
            <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400">Instrucciones</h3>
            <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-300">{questionnaire.instructions}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
              {questionCount} pregunta{questionCount !== 1 ? "s" : ""}
            </span>
          </span>
          {questionnaire.cooldown_minutes ? (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {questionnaire.cooldown_minutes} min de espera entre intentos
            </span>
          ) : null}
        </div>

        {!canStart ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
              <Timer className="h-5 w-5" />
              Tiempo de espera: {formatTime(cooldownRemaining)}
            </p>
          </div>
        ) : (
          <button
            onClick={handleStart}
            disabled={starting || !canStart}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Play className="h-5 w-5" />
            {starting ? "Iniciando..." : "Iniciar intento"}
          </button>
        )}
      </div>

      {/* Attempt history */}
      {attempts.length > 0 && (
        <div className="card p-6 animate-fade-in-up">
          <h2 className="section-title mb-4">
            <span className="section-title-icon">
              <Clock className="h-5 w-5" />
            </span>
            Intentos anteriores
          </h2>

          {/* Desktop table */}
          <div className="hidden sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs font-semibold text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  <th className="pb-2 pr-4">#</th>
                  <th className="pb-2 pr-4">Fecha</th>
                  <th className="pb-2 pr-4">Puntaje</th>
                  <th className="pb-2 pr-4">Porcentaje</th>
                  <th className="pb-2 pr-4">Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a, i) => {
                  const timeSpent = a.finished_at
                    ? Math.round((new Date(a.finished_at).getTime() - new Date(a.started_at).getTime()) / 1000)
                    : 0
                  return (
                    <tr key={a.id} className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-2 pr-4 font-bold text-zinc-400">{i + 1}</td>
                      <td className="py-2 pr-4 text-zinc-700 dark:text-zinc-300">
                        {new Date(a.started_at).toLocaleDateString("es-MX", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="py-2 pr-4">
                        <span className="font-bold text-zinc-800 dark:text-zinc-100">
                          {a.score ?? "-"} / {a.total_questions ?? "-"}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        <span className={`font-bold ${(a.percentage ?? 0) >= 60 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          {a.percentage ?? 0}%
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-zinc-500 dark:text-zinc-400">
                        {timeSpent > 0 ? formatTime(timeSpent) : "-"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-2 sm:hidden">
            {attempts.map((a, i) => {
              const timeSpent = a.finished_at
                ? Math.round((new Date(a.finished_at).getTime() - new Date(a.started_at).getTime()) / 1000)
                : 0
              return (
                <div key={a.id} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400">Intento #{i + 1}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(a.started_at).toLocaleDateString("es-MX", {
                        day: "numeric", month: "short",
                      })}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`text-lg font-extrabold ${(a.percentage ?? 0) >= 60 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {a.percentage ?? 0}%
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {a.score ?? "-"} / {a.total_questions ?? "-"}
                    </span>
                    {timeSpent > 0 && (
                      <span className="ml-auto text-xs text-zinc-400">{formatTime(timeSpent)}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
