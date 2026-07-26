import type { ReactNode } from "react"

interface QuestCardProps {
  children: ReactNode
  className?: string
}

export default function QuestCard({ children, className = "" }: QuestCardProps) {
  return (
    <div className={`panel-hud p-5 ${className}`}>
      {children}
    </div>
  )
}
