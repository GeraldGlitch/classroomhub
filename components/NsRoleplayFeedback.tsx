import { createClient } from "@/lib/supabase/server"
import { MessageSquareQuote } from "lucide-react"

interface ProgressRecord {
  id: string
  activity_title: string
  date: string
  timestamp: string
  metrics: {
    feedback?: string
  }
}

export default async function NsRoleplayFeedback({ studentId }: { studentId: string }) {
  const supabase = await createClient()

  const { data: records } = await supabase
    .from("progress_records")
    .select("id, activity_title, date, timestamp, metrics")
    .eq("student_id", studentId)
    .eq("activity_type", "ns_roleplay")
    .not("metrics->>feedback", "is", null)
    .not("metrics->>feedback", "eq", "")
    .order("timestamp", { ascending: false })

  const feedbacks = (records ?? []) as ProgressRecord[]

  if (feedbacks.length === 0) return null

  return (
    <div className="card animate-fade-in-up p-6">
      <h3 className="section-title mb-4 text-base">
        <MessageSquareQuote className="h-5 w-5 text-indigo-500" />
        NS Roleplay Feedback
      </h3>
      <div className="space-y-4">
        {feedbacks.map((fb) => (
          <div
            key={fb.id}
            className="rounded-xl border-l-4 border-l-indigo-400 bg-zinc-50 p-4 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-sm dark:border-l-indigo-500 dark:bg-zinc-800"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-bold text-zinc-800 dark:text-zinc-100">
                {fb.activity_title}
              </p>
              <span className="flex-shrink-0 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                {fb.date}
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">
              {fb.metrics.feedback}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
