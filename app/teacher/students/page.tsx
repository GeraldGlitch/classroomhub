import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { Plus } from "lucide-react"
import StudentsList from "./StudentsList"

export default async function StudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: students } = await supabase
    .from("students")
    .select("id, name, avatar_url, access_code")
    .eq("teacher_id", user!.id)
    .order("name")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header animate-fade-in-up">
          <div className="page-header-icon">
            <Image src="/students.svg" alt="" width={36} height={36} className="h-9 w-9" />
          </div>
          <h1 className="page-title">Estudiantes</h1>
        </div>
        <Link
          href="/teacher/students/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Añadir estudiante
        </Link>
      </div>

      <StudentsList students={students ?? []} />
    </div>
  )
}
