"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/lib/actions/auth"
import ThemeToggle from "@/components/ThemeToggle"
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react"

const COLLAPSED_KEY = "teacher-sidebar-collapsed"

const navItems = [
  { href: "/teacher/class-dashboard", label: "Clase", icon: LayoutDashboard },
  { href: "/teacher/students", label: "Estudiantes", icon: Users },
  { href: "/teacher/settings", label: "Ajustes", icon: Settings },
]

function getInitialCollapsed() {
  if (typeof window === "undefined") return false
  const stored = localStorage.getItem(COLLAPSED_KEY)
  return stored === "true"
}

export default function TeacherSidebar({ teacherName }: { teacherName: string }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setCollapsed(getInitialCollapsed())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(COLLAPSED_KEY, String(collapsed))
    }
  }, [collapsed, mounted])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (!mounted) {
    return (
      <>
        <button
          className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
        </button>
        <aside className="flex w-56 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900" />
      </>
    )
  }

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2.5 border-b border-zinc-100 px-3 py-4 dark:border-zinc-800">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950">
          <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        {!collapsed && (
          <span className="truncate text-base font-bold text-zinc-800 dark:text-zinc-100">ClassroomHub</span>
        )}
      </div>

      {!collapsed && (
        <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Profesor</p>
          <p className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">{teacherName}</p>
        </div>
      )}

      <nav className="flex-1 space-y-1.5 px-1.5 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              aria-label={collapsed ? label : undefined}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 hover-lift active:scale-95 ${
                active
                  ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-600/10 dark:bg-indigo-950 dark:text-indigo-300"
                  : "text-zinc-600 hover:-translate-x-0.5 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r bg-indigo-600 dark:bg-indigo-400 animate-scale-in" />
              )}
              <Icon className={`h-6 w-6 flex-shrink-0 transition-transform duration-150 ${active ? "scale-110" : "group-hover:scale-110 group-hover:-rotate-3"}`} />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-zinc-100 p-1 dark:border-zinc-800">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden w-full items-center justify-center rounded-xl p-2.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 active:scale-90 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 lg:flex"
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className={`border-t border-zinc-100 px-1.5 py-2 dark:border-zinc-800 ${collapsed ? "flex justify-center" : "px-3"}`}>
        <ThemeToggle />
      </div>

      <div className={`border-t border-zinc-100 p-1.5 dark:border-zinc-800 ${collapsed ? "flex justify-center" : "p-3"}`}>
        <form action={signOut}>
          <button
            type="submit"
            title={collapsed ? "Cerrar sesión" : undefined}
            aria-label={collapsed ? "Cerrar sesión" : undefined}
            className={`flex items-center gap-3.5 rounded-xl text-sm font-semibold text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600 active:scale-95 dark:text-zinc-400 dark:hover:bg-red-950 dark:hover:text-red-400 ${
              collapsed ? "justify-center p-2.5" : "w-full px-3 py-2.5"
            }`}
          >
            <LogOut className="h-6 w-6 flex-shrink-0" />
            {!collapsed && "Cerrar sesión"}
          </button>
        </form>
      </div>
    </>
  )

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-fade-in lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:hidden"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
        </button>
      )}

      <aside
        className={`hidden flex-col overflow-hidden border-r border-zinc-200 bg-white transition-all duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-900 lg:flex ${
          collapsed ? "w-14" : "w-56"
        }`}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <aside className="fixed inset-y-0 left-0 z-40 flex w-64 animate-slide-in-left flex-col overflow-hidden border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
          {sidebarContent}
        </aside>
      )}
    </>
  )
}
