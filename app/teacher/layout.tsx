import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import TeacherSidebar from "./TeacherSidebar"
import { ToastProvider } from "@/components/Toast"

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: teacher } = await supabase
    .from("teachers")
    .select("name")
    .eq("id", user.id)
    .single()

  return (
    <ToastProvider>
      <div className="flex h-screen">
        <TeacherSidebar teacherName={teacher?.name ?? "Profesor"} />
        <main className="flex-1 overflow-auto bg-zinc-50 p-4 pt-16 sm:p-6 sm:pt-6 dark:bg-zinc-950 mid:bg-[#3a3427]">{children}</main>
      </div>
    </ToastProvider>
  )
}
