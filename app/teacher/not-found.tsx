import Link from "next/link"

export default function TeacherNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6">
      <div className="text-6xl animate-pop-in">🔍</div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Página no encontrada</p>
      <Link href="/teacher" className="btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}
