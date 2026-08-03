import { createClient } from "@/lib/supabase/server"
import { Plus, KeyRound } from "lucide-react"
import Link from "next/link"
import LicenseList from "@/components/admin/LicenseList"
import type { TeacherLookup } from "@/types/database"

export const dynamic = "force-dynamic"

export default async function AdminLicensesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const { q, status } = await searchParams
  const supabase = await createClient()

  const { data: teachersRaw } = await supabase.rpc("get_teachers_for_admin")
  const teachers = (teachersRaw ?? []) as TeacherLookup[]

  let query = supabase.from("licenses").select("*").order("created_at", { ascending: false }).limit(200)
  if (status && status !== "all") {
    query = query.eq("status", status)
  }
  const { data: licensesRaw } = await query
  const licenses = licensesRaw ?? []

  const searchTerm = (q ?? "").trim().toLowerCase()
  let filtered = licenses
  if (searchTerm) {
    const matchingTeacherIds = new Set(
      teachers
        .filter(
          (t) =>
            t.email.toLowerCase().includes(searchTerm) ||
            t.teacher_name.toLowerCase().includes(searchTerm),
        )
        .map((t) => t.teacher_id),
    )
    filtered = licenses.filter(
      (l) =>
        l.license_key.toLowerCase().includes(searchTerm) ||
        matchingTeacherIds.has(l.teacher_id),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header animate-fade-in-up">
          <div className="page-header-icon">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="page-title">Licencias</h1>
        </div>
        <Link href="/admin/licenses/new" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nueva licencia
        </Link>
      </div>

      <LicenseList licenses={filtered} teachers={teachers} />
    </div>
  )
}
