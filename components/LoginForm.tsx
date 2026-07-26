"use client"

import { useState } from "react"
import { useActionState } from "react"
import { loginTeacher, findStudentByCode } from "@/lib/actions/auth"
import { LogIn, GraduationCap, Loader2 } from "lucide-react"
import GameButton from "@/components/ui/GameButton"

type Tab = "teacher" | "student"

const inputClass =
  "mt-1 block w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-indigo-800"

const labelClass =
  "block text-sm font-semibold text-zinc-700 dark:text-zinc-300"

export default function LoginForm() {
  const [tab, setTab] = useState<Tab>("student")

  const [teacherState, teacherAction, teacherPending] = useActionState(
    loginTeacher,
    undefined,
  )

  const [studentState, studentAction, studentPending] = useActionState(
    findStudentByCode,
    undefined,
  )

  return (
    <div className="panel-hud p-6 shadow-lg shadow-zinc-200/50 dark:shadow-black/20">
      <div className="relative mb-6 flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
        <div
          className={`absolute bottom-1 top-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow-sm transition-transform duration-200 dark:bg-zinc-900 ${
            tab === "teacher" ? "translate-x-full" : "translate-x-0"
          }`}
          style={{ transitionTimingFunction: "var(--ease-bounce)" }}
        />
        <button
          type="button"
          onClick={() => setTab("teacher")}
          className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors active:scale-95 ${
            tab === "teacher"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <LogIn className={`h-5 w-5 transition-transform duration-200 ${tab === "teacher" ? "scale-110" : ""}`} />
          Profesor
        </button>
        <button
          type="button"
          onClick={() => setTab("student")}
          className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors active:scale-95 ${
            tab === "student"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <GraduationCap className={`h-5 w-5 transition-transform duration-200 ${tab === "student" ? "scale-110" : ""}`} />
          Estudiante
        </button>
      </div>

      {tab === "teacher" ? (
        <form key="teacher" action={teacherAction} className="space-y-4 animate-fade-in-up">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={inputClass}
              placeholder="profesor@ejemplo.com"
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          {teacherState?.error && (
            <p className="text-sm text-red-500">{teacherState.error}</p>
          )}
          <GameButton type="submit" disabled={teacherPending} className="w-full">
            {teacherPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </GameButton>
        </form>
      ) : (
        <form key="student" action={studentAction} className="space-y-4 animate-fade-in-up">
          <div>
            <label htmlFor="code" className={labelClass}>
              Código de acceso
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              className={inputClass}
              placeholder="prefijo-gerald123"
              maxLength={50}
            />
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Ingresa el código completo: <span className="font-mono font-medium text-zinc-500 dark:text-zinc-400">prefijo-tucódigo</span> (proporcionado por tu profesor)
            </p>
          </div>
          {studentState?.error && (
            <p className="text-sm text-red-500">{studentState.error}</p>
          )}
          <GameButton type="submit" disabled={studentPending} className="w-full">
            {studentPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Acceder"
            )}
          </GameButton>
        </form>
      )}
    </div>
  )
}
