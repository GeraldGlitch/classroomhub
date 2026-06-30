import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { redirect } from "next/navigation"
import ProgressChart from "./ProgressChart"

export default async function StudentProgressPage() {
  const cookieStore = await cookies()
  const studentId = cookieStore.get("student_id")?.value
  if (!studentId) redirect("/login")

  const supabase = await createClient()
  const { data: records } = await supabase
    .from("progress_records")
    .select("id, activity_type, activity_title, date, timestamp, metrics, source")
    .eq("student_id", studentId)
    .order("timestamp", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <Image src="/progress.png" alt="" width={36} height={36} className="h-9 w-9" />
        </div>
        <h1 className="page-title">Progreso</h1>
      </div>

      <ProgressChart records={records ?? []} />
    </div>
  )
}