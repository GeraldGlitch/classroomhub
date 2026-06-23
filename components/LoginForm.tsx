"use client"

import { useState } from "react"
import { useActionState } from "react"
import { loginTeacher, findTeacherByCode } from "@/lib/actions/auth"
import { LogIn, GraduationCap } from "lucide-react"

type Tab = "teacher" | "student"

export default function LoginForm() {
  const [tab, setTab] = useState<Tab>("teacher")

  const [teacherState, teacherAction, teacherPending] = useActionState(
    async (_prev: unknown, formData: FormData) => loginTeacher(formData),
    undefined,
  )

  const [studentState, studentAction, studentPending] = useActionState(
    async (_prev: unknown, formData: FormData) => findTeacherByCode(formData),
    undefined,
  )

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex rounded-lg bg-zinc-100 p-1">
        <button
          type="button"
          onClick={() => setTab("teacher")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            tab === "teacher"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          <LogIn className="h-4 w-4" />
          Profesor
        </button>
        <button
          type="button"
          onClick={() => setTab("student")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            tab === "student"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Estudiante
        </button>
      </div>

      {tab === "teacher" ? (
        <form action={teacherAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="profesor@ejemplo.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
          {teacherState?.error && (
            <p className="text-sm text-red-500">{teacherState.error}</p>
          )}
          <button
            type="submit"
            disabled={teacherPending}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {teacherPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      ) : (
        <form action={studentAction} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-zinc-700">
              Código de acceso
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Ej: a1b2c3"
              maxLength={10}
            />
            <p className="mt-1 text-xs text-zinc-400">
              Ingresa el código proporcionado por tu profesor
            </p>
          </div>
          {studentState?.error && (
            <p className="text-sm text-red-500">{studentState.error}</p>
          )}
          <button
            type="submit"
            disabled={studentPending}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {studentPending ? "Verificando..." : "Acceder"}
          </button>
        </form>
      )}
    </div>
  )
}
