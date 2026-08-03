"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin"
import { generateLicenseKey } from "@/lib/license-key"

const statusSchema = z.enum(["active", "suspended", "expired", "revoked"])
const typeSchema = z.enum(["app_only", "full"])

function toIsoOrNull(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

function toNumOrNull(v: unknown): number | null {
  if (typeof v !== "string" || !v.trim()) return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

async function logEvent(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  licenseId: string,
  actorId: string,
  action: string,
  fromStatus: string | null,
  toStatus: string | null,
  metadata: Record<string, unknown> | null = null,
) {
  await supabase.from("license_events").insert({
    license_id: licenseId,
    actor_id: actorId,
    action,
    from_status: fromStatus,
    to_status: toStatus,
    metadata,
  })
}

function serializeLicense(input: {
  status?: string | null
  expires_at?: string | null
  notes?: string | null
  max_devices?: number | null
}) {
  const out: Record<string, unknown> = {}
  if (input.status !== undefined) out.status = input.status
  if (input.expires_at !== undefined) out.expires_at = input.expires_at
  if (input.notes !== undefined) out.notes = input.notes
  if (input.max_devices !== undefined) out.max_devices = input.max_devices
  for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k]
  return out
}

export async function createLicense(prevState: unknown, formData: FormData) {
  let supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"] | null = null
  let userId = ""
  try {
    const admin = await requireAdmin()
    supabase = admin.supabase
    userId = admin.userId
  } catch {
    return { error: "No autorizado" }
  }

  const parsed = z
    .object({
      teacher_id: z.string().uuid(),
      license_type: typeSchema,
      max_devices: z.number().int().min(1).max(20).default(1),
      expires_at: z.string().datetime().nullable(),
      notes: z.string().max(1000).nullable(),
    })
    .safeParse({
      teacher_id: formData.get("teacher_id"),
      license_type: formData.get("license_type") ?? "app_only",
      max_devices: toNumOrNull(formData.get("max_devices")) ?? 1,
      expires_at: toIsoOrNull(formData.get("expires_at")),
      notes: (formData.get("notes") as string) || null,
    })

  if (!parsed.success) return { error: "Datos inválidos" }

  const { data: license, error } = await supabase
    .from("licenses")
    .insert({
      teacher_id: parsed.data.teacher_id,
      license_key: generateLicenseKey(),
      license_type: parsed.data.license_type,
      status: "active",
      expires_at: parsed.data.expires_at,
      notes: parsed.data.notes,
      max_devices: parsed.data.max_devices,
      created_by: userId,
    })
    .select("id")
    .single()

  if (error || !license) return { error: error?.message ?? "Error al crear licencia" }

  await logEvent(supabase, license.id, userId, "created", null, "active", {
    license_type: parsed.data.license_type,
  })

  revalidatePath("/admin/licenses")
  redirect(`/admin/licenses/${license.id}`)
}

export async function updateLicense(prevState: unknown, formData: FormData) {
  let supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"] | null = null
  let userId = ""
  try {
    const admin = await requireAdmin()
    supabase = admin.supabase
    userId = admin.userId
  } catch {
    return { error: "No autorizado" }
  }

  const parsed = z
    .object({
      id: z.string().uuid(),
      license_type: typeSchema.optional(),
      status: statusSchema.optional(),
      expires_at: z.string().datetime().nullable(),
      notes: z.string().max(1000).nullable(),
      max_devices: z.number().int().min(1).max(20).optional(),
    })
    .safeParse({
      id: formData.get("id"),
      license_type: (formData.get("license_type") as string) || undefined,
      status: (formData.get("status") as string) || undefined,
      expires_at: toIsoOrNull(formData.get("expires_at")),
      notes: (formData.get("notes") as string) || null,
      max_devices: toNumOrNull(formData.get("max_devices")) ?? undefined,
    })

  if (!parsed.success) return { error: "Datos inválidos" }

  const { data: current } = await supabase
    .from("licenses")
    .select("id, license_type, status, expires_at, notes, max_devices")
    .eq("id", parsed.data.id)
    .single()

  if (!current) return { error: "Licencia no encontrada" }

  const changes = serializeLicense(parsed.data)
  if (parsed.data.license_type) changes.license_type = parsed.data.license_type

  const { error } = await supabase.from("licenses").update(changes).eq("id", parsed.data.id)
  if (error) return { error: error.message }

  if (parsed.data.status && parsed.data.status !== current.status) {
    await logEvent(supabase, parsed.data.id, userId, "status_changed", current.status, parsed.data.status)
  }

  const fieldChanges: { field: string; from: unknown; to: unknown }[] = []
  if (parsed.data.expires_at !== current.expires_at) {
    fieldChanges.push({ field: "expires_at", from: current.expires_at, to: parsed.data.expires_at })
  }
  if ((parsed.data.notes ?? null) !== current.notes) {
    fieldChanges.push({ field: "notes", from: current.notes, to: parsed.data.notes })
  }
  if (parsed.data.max_devices !== undefined && parsed.data.max_devices !== current.max_devices) {
    fieldChanges.push({ field: "max_devices", from: current.max_devices, to: parsed.data.max_devices })
  }
  if (parsed.data.license_type && parsed.data.license_type !== current.license_type) {
    fieldChanges.push({ field: "license_type", from: current.license_type, to: parsed.data.license_type })
  }

  if (fieldChanges.length > 0) {
    await logEvent(supabase, parsed.data.id, userId, "updated", null, null, { fields: fieldChanges })
  }

  revalidatePath(`/admin/licenses/${parsed.data.id}`)
  redirect(`/admin/licenses/${parsed.data.id}`)
}

async function changeStatus(
  formData: FormData,
  target: "revoked" | "reactivated" | "suspended",
  extra: Record<string, unknown> = {},
) {
  let supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"] | null = null
  let userId = ""
  try {
    const admin = await requireAdmin()
    supabase = admin.supabase
    userId = admin.userId
  } catch {
    return { error: "No autorizado" }
  }

  const id = formData.get("id") as string
  if (!id) return { error: "Licencia no encontrada" }

  const { data: current } = await supabase
    .from("licenses")
    .select("id, status")
    .eq("id", id)
    .single()
  if (!current) return { error: "Licencia no encontrada" }

  const patch: Record<string, unknown> = { status: target === "reactivated" ? "active" : target }
  if (target === "revoked") {
    patch.revoked_at = new Date().toISOString()
    patch.revoked_reason = (formData.get("reason") as string) || null
  }
  if (target === "reactivated") {
    patch.revoked_at = null
    patch.revoked_reason = null
  }

  const { error } = await supabase.from("licenses").update(patch).eq("id", id)
  if (error) return { error: error.message }

  const action = target === "reactivated" ? "reactivated" : target
  await logEvent(
    supabase,
    id,
    userId,
    action,
    current.status,
    target === "reactivated" ? "active" : target,
    extra,
  )

  revalidatePath(`/admin/licenses/${id}`)
  redirect(`/admin/licenses/${id}`)
}

export async function revokeLicense(prevState: unknown, formData: FormData) {
  const reason = formData.get("reason") as string
  return changeStatus(formData, "revoked", reason ? { reason } : {})
}

export async function suspendLicense(prevState: unknown, formData: FormData) {
  return changeStatus(formData, "suspended")
}

export async function reactivateLicense(prevState: unknown, formData: FormData) {
  return changeStatus(formData, "reactivated")
}

export async function regenerateLicenseKey(prevState: unknown, formData: FormData) {
  let supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"] | null = null
  let userId = ""
  try {
    const admin = await requireAdmin()
    supabase = admin.supabase
    userId = admin.userId
  } catch {
    return { error: "No autorizado" }
  }

  const id = formData.get("id") as string
  if (!id) return { error: "Licencia no encontrada" }

  const newKey = generateLicenseKey()
  const { error } = await supabase.from("licenses").update({ license_key: newKey }).eq("id", id)
  if (error) return { error: error.message }

  await logEvent(supabase, id, userId, "key_regenerated", null, null, { regenerated_at: new Date().toISOString() })

  revalidatePath(`/admin/licenses/${id}`)
  redirect(`/admin/licenses/${id}`)
}

export async function deleteLicense(prevState: unknown, formData: FormData) {
  let supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"] | null = null
  try {
    const admin = await requireAdmin()
    supabase = admin.supabase
  } catch {
    return { error: "No autorizado" }
  }

  const id = formData.get("id") as string
  if (!id) return { error: "Licencia no encontrada" }

  const { error } = await supabase.from("licenses").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/licenses")
  redirect("/admin/licenses")
}
