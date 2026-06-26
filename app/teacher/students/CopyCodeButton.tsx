"use client"

import { useState, useRef, useEffect } from "react"
import { Copy, Check } from "lucide-react"

export default function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API may be blocked
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="press-bouncy flex-shrink-0 rounded-md p-0.5 text-zinc-400 hover:text-indigo-500 active:scale-90"
      title="Copiar código"
      aria-label="Copiar código de acceso"
    >
      <span key={copied ? "check" : "copy"} className="inline-flex animate-pop-in">
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </span>
    </button>
  )
}
