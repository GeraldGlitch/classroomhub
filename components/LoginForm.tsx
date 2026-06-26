"use client"

import { useState } from "react"
import { useActionState } from "react"
import { loginTeacher, findStudentByCode } from "@/lib/actions/auth"
import { LogIn, GraduationCap, Loader2 } from "lucide-react"

type Tab = "teacher" | "student"

const inputClass =
  "mt-1 block w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-indigo-800"

const labelClass =
  "block text-sm font-semibold text-zinc-700 dark:text-zinc-300"

export default function LoginForm() {
  const [tab, setTab] = useState<Tab>("student")

  const [teacherState, teacherAction, teacherPending] = useActionState(
    async (_prev: unknown, formData: FormData) => loginTeacher(formData),
    undefined,
  )

  const [studentState, studentAction, studentPending] = useActionState(
    async (_prev: unknown, formData: FormData) => findStudentByCode(formData),
    undefined,
  )

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20">
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
          <button
            type="submit"
            disabled={teacherPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 transition-all duration-150 hover:bg-indigo-700 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {teacherPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
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
              placeholder="Tu código personal"
              maxLength={10}
            />
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Ingresa el código proporcionado por tu profesor
            </p>
          </div>
          {studentState?.error && (
            <p className="text-sm text-red-500">{studentState.error}</p>
          )}
          <button
            type="submit"
            disabled={studentPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 transition-all duration-150 hover:bg-indigo-700 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {studentPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Acceder"
            )}
          </button>
        </form>
      )}
    </div>
  )
}
