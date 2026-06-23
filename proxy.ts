import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/proxy-utils"

export async function proxy(request: NextRequest) {
  const { supabase, response } = await updateSession(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  if (path.startsWith("/teacher")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (path.startsWith("/student")) {
    const accessCode = request.cookies.get("access_code")?.value
    if (!accessCode) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (path === "/student/select") return response
    const studentId = request.cookies.get("student_id")?.value
    if (!studentId) {
      return NextResponse.redirect(new URL("/student/select", request.url))
    }
  }

  if (path === "/login" && user) {
    return NextResponse.redirect(new URL("/teacher", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
