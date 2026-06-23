"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { studentSignOut } from "@/lib/actions/auth"
import ThemeToggle from "@/components/ThemeToggle"
import {
  User,
  BookOpen,
  Calendar,
  FileText,
  LogOut,
  GraduationCap,
  BookMarked,
} from "lucide-react"

const navItems = [
  { href: "/student/profile", label: "Perfil", icon: User },
  { href: "/student/words", label: "Palabras difíciles", icon: BookMarked },
  { href: "/student/questionnaires", label: "Cuestionarios", icon: FileText },
  { href: "/student/resources", label: "Recursos", icon: BookOpen },
  { href: "/student/agenda", label: "Agenda", icon: Calendar },
]

export default function StudentSidebar({ studentName }: { studentName: string }) {
  const pathname = usePathname()

  return (
    <aside className="flex w-56 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
        <GraduationCap className="h-6 w-6 text-indigo-600" />
        <span className="font-semibold text-zinc-800 dark:text-zinc-100">ClassroomHub</span>
      </div>

      <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">Estudiante</p>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{studentName}</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">
        <ThemeToggle />
      </div>

      <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">
        <form action={studentSignOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </form>
      </div>
    </aside>
  )
}
