import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="text-6xl animate-pop-in">🔍</div>
      <h1 className="animate-fade-in text-6xl font-extrabold tracking-tight text-zinc-300 dark:text-zinc-600">404</h1>
      <p className="text-sm text-zinc-500">Página no encontrada</p>
      <Link
        href="/login"
        className="btn-primary"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
