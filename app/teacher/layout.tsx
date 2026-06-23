import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import TeacherSidebar from "./TeacherSidebar"

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
    <div className="flex h-screen">
      <TeacherSidebar teacherName={teacher?.name ?? "Profesor"} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
