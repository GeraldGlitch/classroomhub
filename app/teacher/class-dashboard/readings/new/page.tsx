import ReadingForm from "../ReadingForm"

export default function NewReadingPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 animate-fade-in text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100">
        Nueva lectura
      </h1>
      <ReadingForm />
    </div>
  )
}
