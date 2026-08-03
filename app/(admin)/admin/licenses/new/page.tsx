import { createClient } from "@/lib/supabase/server"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import LicenseForm from "@/components/admin/LicenseForm"
import type { TeacherLookup } from "@/types/database"

export const dynamic = "force-dynamic"

export default async function NewLicensePage() {
  const supabase = await createClient()
  const { data: teachersRaw } = await supabase.rpc("get_teachers_for_admin")
  const teachers = (teachersRaw ?? []) as TeacherLookup[]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/licenses"
          className="press-bouncy inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-600 transition-all hover:border-indigo-300 hover:text-indigo-600 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>

      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <Plus className="h-7 w-7" />
        </div>
        <h1 className="page-title">Nueva licencia</h1>
      </div>

      <div className="panel-hud p-6">
        <LicenseForm teachers={teachers} />
      </div>
    </div>
  )
}
