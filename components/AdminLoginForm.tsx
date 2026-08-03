"use client"

import { useActionState } from "react"
import { loginAdmin } from "@/lib/actions/admin-auth"
import { Loader2, ShieldCheck } from "lucide-react"
import GameButton from "@/components/ui/GameButton"

const inputClass =
  "mt-1 block w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-all duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-indigo-800"

const labelClass =
  "block text-sm font-semibold text-zinc-700 dark:text-zinc-300"

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, undefined)

  return (
    <form action={formAction} className="space-y-4 animate-fade-in-up">
      <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        <ShieldCheck className="h-4 w-4" />
        Acceso de administrador
      </div>
      <div>
        <label htmlFor="admin-email" className={labelClass}>
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          className={inputClass}
          placeholder="admin@classroomhub.app"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className={labelClass}>
          Contraseña
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          className={inputClass}
          placeholder="••••••••"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <GameButton type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verificando...
          </>
        ) : (
          "Entrar como admin"
        )}
      </GameButton>
    </form>
  )
}
