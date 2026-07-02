import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { Plus } from "lucide-react"
import Link from "next/link"
import ReadingsList from "./ReadingsList"

export default async function ReadingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: readings } = await supabase
    .from("readings")
    .select("id, title, text, topic_group, created_at, updated_at")
    .eq("teacher_id", user!.id)
    .order("topic_group", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  const list = readings ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header animate-fade-in-up">
          <div className="page-header-icon bg-emerald-100 dark:bg-emerald-950">
            <Image src="/reading.svg" alt="" width={36} height={36} className="h-9 w-9" />
          </div>
          <h1 className="page-title">Lecturas</h1>
        </div>
        <Link
          href="/teacher/class-dashboard/readings/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nueva lectura
        </Link>
      </div>

      <ReadingsList readings={list} />
    </div>
  )
}
