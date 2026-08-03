import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminSidebar from "./AdminSidebar"
import { ToastProvider } from "@/components/Toast"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: isAdmin } = await supabase.rpc("is_admin")
  if (!isAdmin) redirect("/teacher")

  return (
    <ToastProvider>
      <div className="flex h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-auto bg-zinc-50 p-4 pt-16 sm:p-6 sm:pt-6 dark:bg-zinc-950">{children}</main>
      </div>
    </ToastProvider>
  )
}
