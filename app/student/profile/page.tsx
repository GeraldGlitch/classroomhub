import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
export default async function StudentProfilePage() {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_id")?.value
  if (!studentId) redirect("/login")

  const supabase = await createClient()
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", studentId)
    .single()

  if (!student) redirect("/login")

  const fields = (student.custom_fields ?? {}) as Record<string, string>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-800">Mi Perfil</h1>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-800">{student.name}</h2>
          </div>
        </div>
      </div>

      {Object.keys(fields).length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-zinc-700">Información adicional</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(fields).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-zinc-50 p-3">
                <p className="text-xs font-medium text-zinc-400">{key}</p>
                <p className="text-sm text-zinc-700">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
