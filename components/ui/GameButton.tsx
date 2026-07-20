import type { ButtonHTMLAttributes, ReactNode } from "react"

type Variant = "primary" | "xp" | "danger"

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-indigo-600 border-indigo-800 text-white hover:bg-indigo-500 dark:border-indigo-900",
  xp: "bg-amber-400 border-amber-600 text-amber-950 hover:bg-amber-300 dark:border-amber-700",
  danger: "bg-red-500 border-red-700 text-white hover:bg-red-400 dark:border-red-800",
}

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

export default function GameButton({
  variant = "primary",
  className = "",
  children,
  disabled,
  ...props
}: GameButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`btn-3d active:btn-3d-active inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold uppercase tracking-wide disabled:translate-y-0 disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
