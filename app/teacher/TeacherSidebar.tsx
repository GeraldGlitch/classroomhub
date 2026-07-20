"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "@/lib/actions/auth"
import ThemeToggle from "@/components/ThemeToggle"
import {
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react"

const COLLAPSED_KEY = "teacher-sidebar-collapsed"

interface NavItem {
  href: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  customIcon?: string
}

const navItems: NavItem[] = [
  { href: "/teacher/class-dashboard/resources", label: "Recursos", customIcon: "/recursos.svg" },
  { href: "/teacher/students", label: "Estudiantes", customIcon: "/students.svg" },
  { href: "/teacher/class-dashboard/words-vault", label: "Bóveda de palabras", customIcon: "/words-vault.svg" },
  { href: "/teacher/class-dashboard/roleplays", label: "Roleplays", customIcon: "/roleplays.svg" },
  { href: "/teacher/class-dashboard/readings", label: "Lecturas", customIcon: "/reading.svg" },
  { href: "/teacher/class-dashboard/questionnaires", label: "Cuestionarios", customIcon: "/questionnaries.svg" },
  { href: "/teacher/class-dashboard/agenda", label: "Agenda", customIcon: "/agenda.svg" },
  { href: "/teacher/settings", label: "Ajustes", customIcon: "/settings.svg" },
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
        <aside className="flex w-56 flex-col border-r-2 border-zinc-200 bg-white dark:border-zinc-700 dark:bg-[#131318]" />
      </>
    )
  }

  const sidebarContent = (
    <>
      <Link
        href="/teacher/class-dashboard"
        className="flex items-center gap-2.5 border-b border-zinc-100 px-3 py-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border-2 border-indigo-400 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-950">
          <Image src="/character.svg" alt="ClassroomHub" width={32} height={32} className="h-8 w-8 animate-bob" />
        </div>
        {!collapsed && (
          <span className="truncate text-base font-bold text-zinc-800 dark:text-zinc-100">ClassroomHub</span>
        )}
      </Link>

      {!collapsed && (
        <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Profesor</p>
          <p className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">{teacherName}</p>
        </div>
      )}

      <nav className="flex-1 space-y-1.5 px-1.5 py-4">
        {navItems.map(({ href, label, icon: Icon, customIcon }) => {
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
                <span className="absolute left-0 top-1/2 h-7 w-1.5 -translate-y-1/2 rounded-r bg-gradient-to-b from-indigo-400 to-indigo-600 animate-scale-in" />
              )}
              {customIcon ? (
                <Image src={customIcon} alt="" width={32} height={32} className="h-8 w-8 flex-shrink-0" />
              ) : Icon ? (
                <Icon className={`h-6 w-6 flex-shrink-0 transition-transform duration-150 ${active ? "scale-110" : "group-hover:scale-110 group-hover:-rotate-3"}`} />
              ) : null}
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
            <Image src="/salir.svg" alt="" width={32} height={32} className="h-8 w-8 flex-shrink-0" />
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
        className={`hidden flex-col overflow-hidden border-r-2 border-zinc-200 bg-white transition-all duration-300 ease-out dark:border-zinc-700 dark:bg-[#131318] lg:flex ${
          collapsed ? "w-14" : "w-56"
        }`}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <aside className="fixed inset-y-0 left-0 z-40 flex w-64 animate-slide-in-left flex-col overflow-hidden border-r-2 border-zinc-200 bg-white dark:border-zinc-700 dark:bg-[#131318] lg:hidden">
          {sidebarContent}
        </aside>
      )}
    </>
  )
}
