import type { ReactNode } from "react"

type Accent = "xp" | "mana" | "loot" | "hp"

const accentClasses: Record<Accent, string> = {
  xp: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  mana: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  loot: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
  hp: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
}

interface StatChipProps {
  icon: ReactNode
  label: string
  value: string | number
  accent?: Accent
}

export default function StatChip({ icon, label, value, accent = "xp" }: StatChipProps) {
  return (
    <div className="panel-hud flex items-center gap-3 p-4 transition-transform duration-150 hover:-translate-y-0.5">
      <span
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-xl font-extrabold text-zinc-800 dark:text-zinc-100">{value}</p>
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          {label}
        </p>
      </div>
    </div>
  )
}
