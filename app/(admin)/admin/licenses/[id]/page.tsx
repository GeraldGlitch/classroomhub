import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, KeyRound } from "lucide-react"
import { StatusBadge, TypeBadge } from "@/components/admin/StatusBadge"
import LicenseForm from "@/components/admin/LicenseForm"
import LicenseActions from "@/components/admin/LicenseActions"
import LicenseEvents, { LicenseEventsHeader } from "@/components/admin/LicenseEvents"
import type { TeacherLookup } from "@/types/database"

export const dynamic = "force-dynamic"

function fmtDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("es-NI", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function LicenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: license } = await supabase.from("licenses").select("*").eq("id", id).single()
  if (!license) notFound()

  const [{ data: events }, { data: teachersRaw }] = await Promise.all([
    supabase.from("license_events").select("*").eq("license_id", id).order("created_at", { ascending: false }),
    supabase.rpc("get_teachers_for_admin"),
  ])

  const teachers = (teachersRaw ?? []) as TeacherLookup[]
  const teacher = teachers.find((t) => t.teacher_id === license.teacher_id)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/licenses"
          className="press-bouncy inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-600 transition-all hover:border-indigo-300 hover:text-indigo-600 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>

      <div className="panel-hud space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="page-header-icon">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="font-mono text-lg font-bold tracking-wide text-zinc-800 dark:text-zinc-100">
              {license.license_key}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <TypeBadge type={license.license_type} />
            <StatusBadge status={license.status} />
          </div>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Profesor</p>
            <p className="font-medium text-zinc-800 dark:text-zinc-100">{teacher?.teacher_name ?? "—"}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{teacher?.email ?? "—"}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Creada</p>
            <p className="font-medium text-zinc-800 dark:text-zinc-100">{fmtDate(license.created_at)}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Expira</p>
            <p className="font-medium text-zinc-800 dark:text-zinc-100">{fmtDate(license.expires_at)}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Máx. dispositivos</p>
            <p className="font-medium text-zinc-800 dark:text-zinc-100">{license.max_devices}</p>
          </div>
        </div>

        {license.notes && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">Notas</p>
            <p className="mt-0.5 whitespace-pre-wrap">{license.notes}</p>
          </div>
        )}

        {license.status === "revoked" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            Revocada el {fmtDate(license.revoked_at)}
            {license.revoked_reason && <span> — {license.revoked_reason}</span>}
          </div>
        )}

        <LicenseActions license={license} />
      </div>

      <div className="panel-hud space-y-4 p-6">
        <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">Editar licencia</h2>
        <LicenseForm license={license} teachers={teachers} />
      </div>

      <div className="panel-hud space-y-4 p-6">
        <LicenseEventsHeader />
        <LicenseEvents events={events ?? []} />
      </div>
    </div>
  )
}
