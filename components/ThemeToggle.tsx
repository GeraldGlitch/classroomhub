"use client"

import { useEffect, useState } from "react"
import { Sun, Moon, CloudSun } from "lucide-react"

type Theme = "light" | "mid" | "dark"

const ORDER: Theme[] = ["light", "mid", "dark"]

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle("dark", theme !== "light")
  root.classList.toggle("mid", theme === "mid")
  localStorage.setItem("theme", theme)
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme")
    const initial: Theme = stored === "dark" || stored === "mid" ? stored : "light"
    setTheme(initial)
    applyTheme(initial)
  }, [])

  function cycle() {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]
    setTheme(next)
    applyTheme(next)
  }

  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]

  const NAMES = { light: "Claro", mid: "Intermedio", dark: "Oscuro" } as const

  const meta = {
    light: { icon: <Sun className="h-5 w-5 text-amber-500 dark:text-amber-400" /> },
    mid: { icon: <CloudSun className="h-5 w-5 text-amber-500 dark:text-amber-300" /> },
    dark: { icon: <Moon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" /> },
  } as const

  const current = meta[theme]

  if (!mounted) {
    return <div className="h-10 w-10" />
  }

  return (
    <button
      onClick={cycle}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-600 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-700 active:scale-90 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      title={`Tema actual: ${NAMES[theme]} — cambiar a ${NAMES[next]}`}
      aria-label={`Cambiar a tema ${NAMES[next]}`}
    >
      <span
        key={theme}
        className="inline-flex animate-pop-in"
      >
        {current.icon}
      </span>
    </button>
  )
}