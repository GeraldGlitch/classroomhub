import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, User } from "lucide-react"
import DeleteStudentButton from "./DeleteStudentButton"

export default async function StudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: students } = await supabase
    .from("students")
    .select("id, name, avatar_url")
    .eq("teacher_id", user!.id)
    .order("name")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-800">Estudiantes</h1>
        <Link
          href="/teacher/students/new"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Añadir estudiante
        </Link>
      </div>

      {!students || students.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <User className="h-10 w-10 text-zinc-300" />
          <h2 className="font-semibold text-zinc-600">No hay estudiantes</h2>
          <p className="text-sm text-zinc-400">Añade tu primer estudiante para empezar</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <Link
                href={`/teacher/students/${student.id}`}
                className="flex-1 text-sm font-medium text-zinc-700 hover:text-indigo-600"
              >
                {student.name}
              </Link>
              <DeleteStudentButton id={student.id} name={student.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
