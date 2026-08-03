"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "@/lib/actions/auth"
import ThemeToggle from "@/components/ThemeToggle"
import { KeyRound, LayoutDashboard } from "lucide-react"

const navItems = [
  { href: "/admin/licenses", label: "Licencias", icon: KeyRound },
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-56 flex-col border-r-2 border-zinc-200 bg-white dark:border-zinc-700 dark:bg-[#131318]">
      <Link
        href="/admin"
        className="flex items-center gap-2.5 border-b border-zinc-100 px-3 py-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border-2 border-indigo-400 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-950">
          <Image src="/character.svg" alt="ClassroomHub" width={32} height={32} className="h-8 w-8 animate-bob" />
        </div>
        <span className="truncate text-base font-bold text-zinc-800 dark:text-zinc-100">Admin</span>
      </Link>

      <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">Panel de administración</p>
      </div>

      <nav className="flex-1 space-y-1.5 px-1.5 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 hover-lift active:scale-95 ${
                active
                  ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-600/10 dark:bg-indigo-950 dark:text-indigo-300"
                  : "text-zinc-600 hover:-translate-x-0.5 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-7 w-1.5 -translate-y-1/2 rounded-r bg-gradient-to-b from-indigo-400 to-indigo-600 animate-scale-in" />
              )}
              <Icon className={`h-6 w-6 flex-shrink-0 transition-transform duration-150 ${active ? "scale-110" : "group-hover:scale-110 group-hover:-rotate-3"}`} />
              <span className="truncate">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-zinc-100 p-1.5 dark:border-zinc-800">
        <ThemeToggle />
      </div>

      <div className="border-t border-zinc-100 p-1.5 dark:border-zinc-800">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600 active:scale-95 dark:text-zinc-400 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <Image src="/salir.svg" alt="" width={32} height={32} className="h-8 w-8 flex-shrink-0" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  )
}
