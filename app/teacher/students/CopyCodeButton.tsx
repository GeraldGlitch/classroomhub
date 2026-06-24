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
      className="flex-shrink-0 text-zinc-300 hover:text-indigo-500"
      title="Copiar código"
      aria-label="Copiar código de acceso"
    >
      <span key={copied ? "check" : "copy"} className="inline-flex animate-scale-in">
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </span>
    </button>
  )
}
