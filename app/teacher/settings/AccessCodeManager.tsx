"use client"

import { useActionState, useState } from "react"
import { regenerateCode } from "./actions"
import { Copy, RefreshCw } from "lucide-react"

interface ActionState {
  code?: string
  error?: string
}

export default function AccessCodeManager({ currentCode }: { currentCode: string }) {
  const [code, setCode] = useState(currentCode)
  const [copied, setCopied] = useState(false)

  const action = async (_prev: ActionState | null, formData: FormData) => {
    const result = await regenerateCode(_prev, formData)
    if (result?.code) setCode(result.code)
    return result
  }

  const [, formAction, pending] = useActionState(action, null)

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-indigo-50 px-4 py-3">
          <span className="text-2xl font-bold tracking-widest text-indigo-700">
            {code}
          </span>
        </div>
        <button
          onClick={copyCode}
          className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
          title="Copiar código"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
      {copied && <p className="mt-1 text-xs text-green-600">¡Copiado!</p>}

      <form action={formAction} className="mt-4">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} />
          Generar nuevo código
        </button>
      </form>
    </div>
  )
}
