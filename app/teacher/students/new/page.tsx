import StudentForm from "../StudentForm"

export default function NewStudentPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-zinc-800 dark:text-zinc-100">Nuevo estudiante</h1>
      <StudentForm />
    </div>
  )
}
