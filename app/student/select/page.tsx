import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import StudentSelectForm from "./StudentSelectForm"

export default async function StudentSelectPage() {
  const cookieStore = await cookies()
  const teacherId = cookieStore.get("teacher_id")?.value

  if (!teacherId) redirect("/login")

  const supabase = await createClient()
  const { data: students } = await supabase
    .from("students")
    .select("id, name")
    .eq("teacher_id", teacherId)
    .order("name")

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-indigo-600">ClassroomHub</h1>
          <p className="mt-1 text-sm text-zinc-500">Selecciona tu perfil</p>
        </div>
        <StudentSelectForm students={students ?? []} />
      </div>
    </div>
  )
}
