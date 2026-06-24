import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import StudentSidebar from "./StudentSidebar"
import { ToastProvider } from "@/components/Toast"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_id")?.value
  const studentName = cookieStore.get("student_name")?.value

  if (!studentId) redirect("/login")

  return (
    <ToastProvider>
      <div className="flex h-screen">
        <StudentSidebar studentName={studentName ?? "Estudiante"} />
        <main className="flex-1 overflow-auto bg-zinc-50 p-4 pt-16 sm:p-6 sm:pt-6 dark:bg-zinc-950">{children}</main>
      </div>
    </ToastProvider>
  )
}
