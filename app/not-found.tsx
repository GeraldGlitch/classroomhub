import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-zinc-300">404</h1>
      <p className="text-sm text-zinc-500">Página no encontrada</p>
      <Link
        href="/login"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
