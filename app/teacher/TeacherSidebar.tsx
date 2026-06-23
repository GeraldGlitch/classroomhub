"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/lib/actions/auth"
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react"

const navItems = [
  { href: "/teacher/class-dashboard", label: "Clase", icon: LayoutDashboard },
  { href: "/teacher/students", label: "Estudiantes", icon: Users },
  { href: "/teacher/settings", label: "Ajustes", icon: Settings },
]

export default function TeacherSidebar({ teacherName }: { teacherName: string }) {
  const pathname = usePathname()

  return (
    <aside className="flex w-56 flex-col border-r border-zinc-200 bg-white">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-4">
        <GraduationCap className="h-6 w-6 text-indigo-600" />
        <span className="font-semibold text-zinc-800">ClassroomHub</span>
      </div>

      <div className="border-b border-zinc-100 px-5 py-3">
        <p className="text-xs text-zinc-400">Profesor</p>
        <p className="text-sm font-medium text-zinc-700">{teacherName}</p>
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
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-zinc-100 p-3">
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  )
}
