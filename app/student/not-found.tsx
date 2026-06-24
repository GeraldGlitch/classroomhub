import Link from "next/link"

export default function StudentNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6">
      <div className="text-5xl">🔍</div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Página no encontrada</p>
      <Link href="/student" className="btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}
