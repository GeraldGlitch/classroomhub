"use client"

import { useActionState, useState } from "react"
import {
  revokeLicense,
  suspendLicense,
  reactivateLicense,
  regenerateLicenseKey,
  deleteLicense,
} from "@/lib/actions/licenses"
import type { License } from "@/types/database"
import { Ban, Pause, RefreshCw, Play, Trash2, Loader2 } from "lucide-react"

function useSubmit(action: (prev: unknown, fd: FormData) => Promise<{ error?: string } | undefined>) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, fd: FormData) => action(_prev, fd),
    undefined,
  )
  return { state, formAction, pending }
}

export default function LicenseActions({ license }: { license: License }) {
  const revoke = useSubmit(revokeLicense)
  const suspend = useSubmit(suspendLicense)
  const reactivate = useSubmit(reactivateLicense)
  const regenerate = useSubmit(regenerateLicenseKey)
  const remove = useSubmit(deleteLicense)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [reason, setReason] = useState("")

  const error =
    revoke.state?.error ?? suspend.state?.error ?? reactivate.state?.error ?? regenerate.state?.error ?? remove.state?.error

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {license.status === "active" && (
          <>
            <form action={revoke.formAction}>
              <input type="hidden" name="id" value={license.id} />
              <input type="hidden" name="reason" value={reason} />
              <button
                type="submit"
                disabled={revoke.pending}
                className="press-bouncy inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-95 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950"
              >
                {revoke.pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                Revocar
              </button>
            </form>
            <form action={suspend.formAction}>
              <input type="hidden" name="id" value={license.id} />
              <button
                type="submit"
                disabled={suspend.pending}
                className="press-bouncy inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3.5 py-2 text-sm font-semibold text-amber-600 transition-all hover:bg-amber-50 active:scale-95 dark:border-amber-900 dark:bg-zinc-900 dark:text-amber-400 dark:hover:bg-amber-950"
              >
                {suspend.pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pause className="h-4 w-4" />}
                Suspender
              </button>
            </form>
          </>
        )}

        {license.status !== "active" && license.status !== "revoked" && (
          <form action={reactivate.formAction}>
            <input type="hidden" name="id" value={license.id} />
            <button
              type="submit"
              disabled={reactivate.pending}
              className="press-bouncy inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3.5 py-2 text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-50 active:scale-95 dark:border-emerald-900 dark:bg-zinc-900 dark:text-emerald-400 dark:hover:bg-emerald-950"
            >
              {reactivate.pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Reactivar
            </button>
          </form>
        )}

        <form action={regenerate.formAction}>
          <input type="hidden" name="id" value={license.id} />
          <button
            type="submit"
            disabled={regenerate.pending}
            className="press-bouncy inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-700 transition-all hover:border-indigo-300 hover:text-indigo-600 active:scale-95 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
          >
            {regenerate.pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Regenerar key
          </button>
        </form>

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="press-bouncy inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-500 transition-all hover:border-red-300 hover:text-red-600 active:scale-95 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-red-900 dark:hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Cancelar
            </button>
            <form action={remove.formAction}>
              <input type="hidden" name="id" value={license.id} />
              <button
                type="submit"
                disabled={remove.pending}
                className="press-bouncy inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-red-600/30 transition-all hover:bg-red-700 active:scale-95"
              >
                {remove.pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Confirmar eliminación
              </button>
            </form>
          </div>
        )}
      </div>

      {license.status === "active" && (
        <div>
          <label htmlFor="revoke-reason" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Razón (opcional) para revocar
          </label>
          <input
            id="revoke-reason"
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 block w-full max-w-sm rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-indigo-800"
            placeholder="Ej: no renovó pago"
          />
        </div>
      )}
    </div>
  )
}
