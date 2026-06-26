import ResourceForm from "../ResourceForm"

export default function NewResourcePage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 animate-fade-in text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100">Nuevo recurso</h1>
      <ResourceForm />
    </div>
  )
}
