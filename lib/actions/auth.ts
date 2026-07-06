"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function loginTeacher(prevState: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: "Email o contraseña inválidos" }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword(parsed.data)

    if (error) {
      return { error: error.message === "Invalid login credentials"
        ? "Email o contraseña incorrectos"
        : "Error al iniciar sesión" }
    }
  } catch (e) {
    console.error("loginTeacher error:", e)
    return { error: "Error al conectar con el servidor" }
  }

  redirect("/teacher")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function findStudentByCode(prevState: unknown, formData: FormData) {
  const code = formData.get("code") as string
  if (!code || code.trim().length < 3) {
    return { error: "Código inválido" }
  }

  const trimmed = code.trim()
  const supabase = await createClient()

  // Prefix-code format: teacher_prefix-student_code
  const dashIdx = trimmed.indexOf("-")
  if (dashIdx > 0) {
    const { data: student } = await supabase
      .from("students")
      .select("id, name, teacher_id")
      .eq("access_code", trimmed)
      .single()

    if (!student) return { error: "Código incorrecto" }

    const cookieStore = await cookies()
    cookieStore.set("student_id", student.id, {
      path: "/",
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
    })
    cookieStore.set("student_name", student.name, {
      path: "/",
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
    })
    cookieStore.set("teacher_id", student.teacher_id, {
      path: "/",
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
    })

    redirect("/student")
  }

  // Legacy: no dash, search globally (existing students without prefixed code)
  const { data: students } = await supabase
    .from("students")
    .select("id, name, teacher_id")
    .eq("access_code", trimmed)
    .limit(1)

  if (!students || students.length === 0) {
    return { error: "Código incorrecto" }
  }

  const student = students[0]
  const cookieStore = await cookies()
  cookieStore.set("student_id", student.id, {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    sameSite: "lax",
  })
  cookieStore.set("student_name", student.name, {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    sameSite: "lax",
  })
  cookieStore.set("teacher_id", student.teacher_id, {
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    sameSite: "lax",
  })

  redirect("/student")
}

export async function studentSignOut() {
  const cookieStore = await cookies()
  cookieStore.delete("student_id")
  cookieStore.delete("student_name")
  cookieStore.delete("teacher_id")
  redirect("/login")
}
