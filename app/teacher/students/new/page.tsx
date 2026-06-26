import StudentForm from "../StudentForm"

export default function NewStudentPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 animate-fade-in text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100">Nuevo estudiante</h1>
      <StudentForm />
    </div>
  )
}
