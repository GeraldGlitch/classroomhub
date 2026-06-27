import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Smile } from "lucide-react"

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
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <Image src="/login.svg" alt="" width={28} height={28} className="h-7 w-7" />
        </div>
        <h1 className="page-title">Mi Perfil</h1>
      </div>

      <div className="card animate-fade-in-up p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-indigo-100 shadow-sm dark:bg-indigo-950">
            <Smile className="h-11 w-11 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100">{student.name}</h2>
          </div>
        </div>
      </div>

      {Object.keys(fields).length > 0 && (
        <div className="card animate-fade-in-up p-6">
          <h3 className="section-title mb-4 text-base">
            Información adicional
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(fields).map(([key, value]) => (
              <div key={key} className="rounded-xl bg-zinc-50 p-3 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-sm dark:bg-zinc-800">
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">{key}</p>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
