import type { ReactNode } from "react"

interface QuestCardProps {
  children: ReactNode
  glow?: boolean
  className?: string
}

export default function QuestCard({ children, glow = false, className = "" }: QuestCardProps) {
  return (
    <div className={`panel-hud p-5 ${glow ? "animate-glow-pulse" : ""} ${className}`}>
      {children}
    </div>
  )
}
