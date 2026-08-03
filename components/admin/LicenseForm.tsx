"use client"

import { useActionState, useState } from "react"
import { createLicense, updateLicense } from "@/lib/actions/licenses"
import type { License, TeacherLookup, LicenseType } from "@/types/database"

const inputClass =
  "mt-1 block w-full rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"

const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300"

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return ""
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const TYPES: { value: LicenseType; label: string; desc: string }[] = [
  { value: "app_only", label: "Tipo 1 (App)", desc: "Solo app de escritorio" },
  { value: "full", label: "Tipo 2 (Full)", desc: "App + portal completo" },
]

export default function LicenseForm({
  license,
  teachers,
}: {
  license?: License
  teachers: TeacherLookup[]
}) {
  const action = license ? updateLicense : createLicense
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => action(_prev, formData),
    undefined,
  )
  const [selectedType, setSelectedType] = useState<LicenseType>(license?.license_type ?? "app_only")

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </div>
      )}
      {license && <input type="hidden" name="id" value={license.id} />}

      {!license && (
        <div>
          <label className={labelClass}>
            Profesor
          </label>
          <select name="teacher_id" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Selecciona un profesor...
            </option>
            {teachers.map((t) => (
              <option key={t.teacher_id} value={t.teacher_id}>
                {t.teacher_name} — {t.email}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={labelClass}>Tipo de licencia</label>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {TYPES.map((t) => {
            const isActive = selectedType === t.value
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setSelectedType(t.value)}
                className={`press-bouncy rounded-xl border px-4 py-3 text-left transition-all active:scale-95 ${
                  isActive
                    ? "border-indigo-300 bg-indigo-50 shadow-sm dark:border-indigo-700 dark:bg-indigo-950"
                    : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                }`}
              >
                <p className={`text-sm font-semibold ${isActive ? "text-indigo-700 dark:text-indigo-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                  {t.label}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.desc}</p>
              </button>
            )
          })}
        </div>
        <input type="hidden" name="license_type" value={selectedType} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="expires_at" className={labelClass}>
            Fecha de expiración
          </label>
          <input
            id="expires_at"
            name="expires_at"
            type="datetime-local"
            defaultValue={license ? toDatetimeLocal(license.expires_at) : ""}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Vacío = sin expiración (perpetua)
          </p>
        </div>

        <div>
          <label htmlFor="max_devices" className={labelClass}>
            Máx. dispositivos
          </label>
          <input
            id="max_devices"
            name="max_devices"
            type="number"
            min={1}
            max={20}
            defaultValue={license?.max_devices ?? 1}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notas internas
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={license?.notes ?? ""}
          placeholder="Solo visible para administradores..."
          className={inputClass}
        />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Guardando..." : license ? "Guardar cambios" : "Crear licencia"}
        </button>
      </div>
    </form>
  )
}
