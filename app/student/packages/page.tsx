import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Image from "next/image"
import { Heart, Info } from "lucide-react"

export default async function StudentPackagesPage() {
  const cookieStore = await cookies()
  const teacherId = cookieStore.get("teacher_id")?.value
  const studentId = cookieStore.get("student_id")?.value
  if (!teacherId || !studentId) redirect("/login")

  const supabase = await createClient()

  const { data: student } = await supabase
    .from("students")
    .select("id, name, hearts_balance")
    .eq("id", studentId)
    .single()

  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("name", { ascending: true })

  const { data: credits } = await supabase
    .from("heart_credits")
    .select("id, status, package_name, acquired_at, consumed_at, removed_at")
    .eq("student_id", studentId)
    .order("acquired_at", { ascending: false })
    .limit(50)

  const availableCount = credits?.filter((c) => c.status === "active").length ?? 0
  const consumedCount = credits?.filter((c) => c.status === "consumed").length ?? 0

  return (
    <div className="space-y-6">
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <Image src="/words-vault.svg" alt="" width={36} height={36} className="h-9 w-9" />
        </div>
        <h1 className="page-title">Paquetes de clases</h1>
        {packages?.length ? (
          <span className="ml-1 self-end mb-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            {packages.length} paquetes
          </span>
        ) : null}
      </div>

      <div className="card animate-fade-in-up p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950">
            <Heart className="h-7 w-7 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">Mi balance</p>
            <p className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">
              {Math.round(student?.hearts_balance ?? 0)} hearts
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 dark:border-rose-950 dark:bg-rose-950/50">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" />
          <p className="text-xs text-rose-700 dark:text-rose-300">
            Cada corazón equivale a una clase. Si no puedes asistir por cualquier motivo, tu balance no se verá
            afectado. El corazón se descuenta únicamente una vez que hayas recibido la clase, sin penalizaciones por
            inasistencia.
          </p>
        </div>
      </div>

      {!packages || packages.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon animate-bob">
            <Image src="/words-vault.svg" alt="" width={52} height={52} className="h-[52px] w-[52px]" />
          </div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No hay paquetes disponibles aún</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {packages.map((pkg, i) => (
            <div
              key={pkg.id}
              className="card card-hover p-5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{pkg.name}</h3>
                  {pkg.description && (
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{pkg.description}</p>
                  )}
                </div>
                <span className="flex-shrink-0 rounded-full bg-rose-100 px-3 py-1 text-sm font-extrabold text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                  {pkg.price || "—"}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  {Math.round(pkg.hearts ?? 0)} hearts
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card animate-fade-in-up p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Historial</h2>
          {credits && credits.length > 0 && (
            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              {credits.length} corazones
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-center dark:border-rose-950 dark:bg-rose-950/50">
            <p className="text-2xl font-extrabold text-rose-500">{availableCount}</p>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Disponibles</p>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-2xl font-extrabold text-zinc-600 dark:text-zinc-300">{consumedCount}</p>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Consumidos</p>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-2xl font-extrabold text-zinc-600 dark:text-zinc-300">{credits?.length ?? 0}</p>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Comprados</p>
          </div>
        </div>

        {!credits || credits.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">
            Aún no hay movimientos en tu historial.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
            {credits.map((credit) => {
              const statusMeta =
                credit.status === "active"
                  ? {
                      label: "Activo",
                      chip: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
                      icon: "fill-rose-500 text-rose-500",
                    }
                  : credit.status === "consumed"
                    ? {
                        label: "Consumido",
                        chip: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
                        icon: "fill-zinc-300 text-zinc-400",
                      }
                    : {
                        label: "Removido",
                        chip: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
                        icon: "fill-zinc-300 text-zinc-400",
                      }
              return (
                <li key={credit.id} className="flex items-center gap-3 py-3">
                  <Heart className={`h-4 w-4 flex-shrink-0 ${statusMeta.icon}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      {credit.package_name || "Corazón"}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {new Date(credit.acquired_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${statusMeta.chip}`}>
                    {statusMeta.label}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
