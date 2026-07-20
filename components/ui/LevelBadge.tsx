interface LevelBadgeProps {
  level: number
  size?: "sm" | "md"
}

export default function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  const sizeClasses =
    size === "sm" ? "h-8 px-2 text-xs" : "h-12 px-3 text-sm"

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 rounded-xl border-2 border-amber-500 bg-amber-100 font-extrabold text-amber-700 dark:bg-amber-950 dark:text-amber-300 ${sizeClasses}`}
    >
      Nv. {level}
    </span>
  )
}
