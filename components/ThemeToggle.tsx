"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme")
    if (stored === "dark") {
      document.documentElement.classList.add("dark")
      setDark(true)
    }
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  if (!mounted) {
    return <div className="h-10 w-10" />
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-600 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-700 active:scale-90 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      title={dark ? "Modo claro" : "Modo oscuro"}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <span
        key={dark ? "sun" : "moon"}
        className="inline-flex animate-pop-in"
      >
        {dark ? (
          <Sun className="h-5 w-5 text-amber-500 dark:text-amber-400" />
        ) : (
          <Moon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
        )}
      </span>
    </button>
  )
}
