import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { Plus, Smile } from "lucide-react"
import DeleteStudentButton from "./DeleteStudentButton"
import CopyCodeButton from "./CopyCodeButton"

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

      {!students || students.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Image src="/students.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-600 dark:text-zinc-400">No hay estudiantes</h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">Añade tu primer estudiante para empezar</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student, i) => (
            <div
              key={student.id}
              className="card card-hover group animate-fade-in-up flex items-center gap-3 p-4"
              style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6 dark:bg-indigo-950 dark:text-indigo-400">
                <Smile className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/teacher/students/${student.id}`}
                  className="text-sm font-bold text-zinc-700 hover:text-indigo-600 truncate block dark:text-zinc-300 dark:hover:text-indigo-400"
                >
                  {student.name}
                </Link>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 tracking-wider">
                    {student.access_code}
                  </span>
                  <CopyCodeButton code={student.access_code} />
                </div>
              </div>
              <DeleteStudentButton id={student.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
