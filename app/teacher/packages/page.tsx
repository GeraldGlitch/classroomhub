import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { Heart } from "lucide-react"
import { redirect } from "next/navigation"
import DeletePackageButton from "./DeletePackageButton"

export default async function TeacherPackagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [packagesRes, studentsRes] = await Promise.all([
    supabase
      .from("packages")
      .select("id, name, description, hearts, price")
      .eq("teacher_id", user.id)
      .order("name", { ascending: true }),
    supabase
      .from("students")
      .select("id, name, hearts_balance")
      .eq("teacher_id", user.id)
      .order("name"),
  ])

  const packages = packagesRes.data ?? []
  const students = studentsRes.data ?? []

  return (
    <div className="space-y-6">
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <Image src="/words-vault.svg" alt="" width={36} height={36} className="h-9 w-9" />
        </div>
        <h1 className="page-title">Paquetes y corazones</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Los paquetes llegan desde la aplicación de escritorio. Aquí puedes eliminarlos.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="section-title mb-4 text-base">Paquetes de clases</h2>
          {packages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon animate-bob">
                <Image src="/words-vault.svg" alt="" width={40} height={40} className="h-10 w-10" />
              </div>
              <p className="text-sm text-zinc-400 dark:text-zinc-500">No hay paquetes aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex items-start justify-between gap-3 rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-zinc-800 dark:text-zinc-100">{pkg.name}</p>
                    {pkg.description && (
                      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{pkg.description}</p>
                    )}
                    <p className="mt-1 flex items-center gap-1 text-sm font-bold text-rose-500">
                      <Heart className="h-4 w-4 fill-rose-500" />
                      {Math.round(pkg.hearts ?? 0)} hearts
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-extrabold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      {pkg.price || "—"}
                    </span>
                    <DeletePackageButton id={pkg.id} name={pkg.name} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="section-title mb-4 text-base">Balance de corazones por estudiante</h2>
          <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            Los corazones representan tus clases disponibles. Cada corazón equivale a una clase y te
            permite llevar un control sencillo de tus clases y asistencias.
          </p>
          {students.length === 0 ? (
            <p className="text-sm text-zinc-400 dark:text-zinc-500">No hay estudiantes aún</p>
          ) : (
            <div className="space-y-2">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <span className="truncate font-medium text-zinc-700 dark:text-zinc-300">{s.name}</span>
                  <span className="flex flex-shrink-0 items-center gap-1 text-sm font-extrabold text-rose-500">
                    <Heart className="h-4 w-4 fill-rose-500" />
                    {Math.round(s.hearts_balance ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}