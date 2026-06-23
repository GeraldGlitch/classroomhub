"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function loginTeacher(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: "Email o contraseña inválidos" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: error.message === "Invalid login credentials"
      ? "Email o contraseña incorrectos"
      : "Error al iniciar sesión" }
  }

  redirect("/teacher")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function findTeacherByCode(formData: FormData) {
  const code = formData.get("code") as string
  if (!code || code.length < 3) {
    return { error: "Código inválido" }
  }

  const supabase = await createClient()
  const { data: teachers } = await supabase
    .from("teachers")
    .select("id, name")
    .eq("access_code", code.trim())
    .limit(1)

  if (!teachers || teachers.length === 0) {
    return { error: "Código incorrecto" }
  }

  const cookieStore = await cookies()
  cookieStore.set("access_code", code.trim(), {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    sameSite: "lax",
  })
  cookieStore.set("teacher_id", teachers[0].id, {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    sameSite: "lax",
  })

  redirect("/student/select")
}

export async function selectStudent(formData: FormData) {
  const studentId = formData.get("studentId") as string
  const studentName = formData.get("studentName") as string

  if (!studentId) return { error: "Selecciona un estudiante" }

  const cookieStore = await cookies()
  cookieStore.set("student_id", studentId, {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    sameSite: "lax",
  })
  cookieStore.set("student_name", studentName, {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    sameSite: "lax",
  })

  redirect("/student")
}

export async function studentSignOut() {
  const cookieStore = await cookies()
  cookieStore.delete("access_code")
  cookieStore.delete("teacher_id")
  cookieStore.delete("student_id")
  cookieStore.delete("student_name")
  redirect("/login")
}
