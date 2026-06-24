import { parseLocalDate } from "@/lib/date"

export default function DateBadge({ dateStr, size = "md" }: { dateStr: string; size?: "sm" | "md" }) {
  const date = parseLocalDate(dateStr)
  const sizes = {
    sm: { wrapper: "px-2 py-1", monthText: "text-[10px] font-semibold uppercase", dayText: "text-sm font-bold" },
    md: { wrapper: "px-3 py-2", monthText: "text-xs font-semibold uppercase", dayText: "text-xl font-bold" },
  }
  const s = sizes[size]
  return (
    <div className={`flex-shrink-0 rounded-lg bg-indigo-100 text-center dark:bg-indigo-950 ${s.wrapper}`}>
      <div className={`${s.monthText} text-indigo-600 dark:text-indigo-400`}>
        {date.toLocaleDateString("es-ES", { month: "short" })}
      </div>
      <div className={`${s.dayText} text-indigo-700 dark:text-indigo-300`}>
        {date.getDate()}
      </div>
    </div>
  )
}
