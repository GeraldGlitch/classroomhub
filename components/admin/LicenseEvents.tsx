import { History } from "lucide-react"
import type { LicenseEvent } from "@/types/database"
import type { LicenseStatus } from "@/types/database"

const actionLabels: Record<string, string> = {
  created: "Creada",
  updated: "Actualizada",
  status_changed: "Cambio de estado",
  key_regenerated: "Key regenerada",
  revoked: "Revocada",
  reactivated: "Reactivada",
  suspended: "Suspendida",
  expired: "Expirada",
  deleted: "Eliminada",
}

const statusLabels: Record<LicenseStatus, string> = {
  active: "Active",
  suspended: "Suspended",
  expired: "Expired",
  revoked: "Revoked",
}

export default function LicenseEvents({ events }: { events: LicenseEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Sin historial de cambios</p>
      </div>
    )
  }

  return (
    <ol className="relative space-y-4 border-l-2 border-zinc-200 pl-5 dark:border-zinc-700">
      {events.map((e) => {
        const transition = e.from_status && e.to_status && e.from_status !== e.to_status
        return (
          <li key={e.id} className="relative">
            <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-400 ring-4 ring-indigo-100 dark:bg-indigo-500 dark:ring-indigo-950" />
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                {actionLabels[e.action] ?? e.action}
              </span>
              {transition && e.from_status && e.to_status && (
                <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-mono">{statusLabels[e.from_status]}</span>
                  <span aria-hidden="true">→</span>
                  <span className="font-mono">{statusLabels[e.to_status]}</span>
                </span>
              )}
              <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
                {new Date(e.created_at).toLocaleString("es-NI", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {e.action === "updated" && e.metadata?.fields && (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Campos: {e.metadata.fields.map((f) => f.field).join(", ")}
              </p>
            )}
            {e.action === "revoked" && e.metadata?.reason && (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Razón: {e.metadata.reason}
              </p>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export function LicenseEventsHeader() {
  return (
    <div className="flex items-center gap-2">
      <History className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
      <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">Historial</h2>
    </div>
  )
}
