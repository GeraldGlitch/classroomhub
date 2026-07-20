interface XPBarProps {
  value: number
  max: number
  label?: string
  showNumbers?: boolean
}

export default function XPBar({ value, max, label, showNumbers = true }: XPBarProps) {
  const safeMax = max > 0 ? max : 1
  const pct = Math.min(100, Math.max(0, Math.round((value / safeMax) * 100)))

  return (
    <div className="w-full">
      {(label || showNumbers) && (
        <div className="mb-1 flex items-center justify-between">
          {label && (
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {label}
            </span>
          )}
          {showNumbers && (
            <span className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="h-4 w-full overflow-hidden rounded-full border border-zinc-300 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800">
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        >
          <div className="animate-shine absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
    </div>
  )
}
