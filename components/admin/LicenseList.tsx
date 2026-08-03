"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, X } from "lucide-react"
import type { License, TeacherLookup } from "@/types/database"
import { StatusBadge, TypeBadge } from "./StatusBadge"

const STATUS_FILTERS = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "expired", label: "Expired" },
  { value: "revoked", label: "Revoked" },
]

function fmtDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("es-NI", { day: "2-digit", month: "short", year: "numeric" })
}

export default function LicenseList({
  licenses,
  teachers,
}: {
  licenses: License[]
  teachers: TeacherLookup[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const q = searchParams.get("q") ?? ""
  const status = searchParams.get("status") ?? "all"

  const teacherMap = new Map(teachers.map((t) => [t.teacher_id, t]))

  const updateFilters = useCallback(
    (patch: { q?: string; status?: string }) => {
      const params = new URLSearchParams(searchParams.toString())
      if (patch.q !== undefined) {
        if (patch.q) params.set("q", patch.q)
        else params.delete("q")
      }
      if (patch.status !== undefined) {
        if (patch.status && patch.status !== "all") params.set("status", patch.status)
        else params.delete("status")
      }
      router.push(`/admin/licenses${params.toString() ? `?${params.toString()}` : ""}`)
    },
    [router, searchParams],
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => updateFilters({ q: e.target.value })}
            placeholder="Buscar por license key o email..."
            className="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-9 pr-9 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-indigo-800"
          />
          {q && (
            <button
              onClick={() => updateFilters({ q: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => updateFilters({ status: f.value })}
              className={`press-bouncy whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                status === f.value
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {licenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No hay licencias</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {q || status !== "all" ? "Prueba con otros filtros" : "Crea tu primera licencia"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">License key</th>
                  <th className="px-4 py-3 font-semibold">Profesor</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Expira</th>
                  <th className="px-4 py-3 font-semibold">Creada</th>
                  <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {licenses.map((l) => {
                  const teacher = teacherMap.get(l.teacher_id)
                  return (
                    <tr key={l.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {l.license_key}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-800 dark:text-zinc-100">{teacher?.teacher_name ?? "—"}</p>
                        <p className="text-xs text-zinc-400">{teacher?.email ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <TypeBadge type={l.license_type} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={l.status} />
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{fmtDate(l.expires_at)}</td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{fmtDate(l.created_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/licenses/${l.id}`}
                          className="press-bouncy inline-flex items-center rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:border-indigo-300 hover:text-indigo-600 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
                        >
                          Detalle
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
