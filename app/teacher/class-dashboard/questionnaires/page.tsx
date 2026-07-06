import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { Plus } from "lucide-react"
import Link from "next/link"
import QuestionnaireList from "./QuestionnaireList"

export default async function QuestionnairesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: questionnaires } = await supabase
    .from("questionnaires")
    .select("id, title, description, topic_group, published, cooldown_minutes, created_at, updated_at")
    .eq("teacher_id", user!.id)
    .order("created_at", { ascending: false })

  const list = questionnaires ?? []

  const questionCounts: Record<string, number> = {}
  for (const q of list) {
    const { count } = await supabase
      .from("questionnaire_questions")
      .select("id", { count: "exact", head: true })
      .eq("questionnaire_id", q.id)
    questionCounts[q.id] = count ?? 0
  }

  const grouped = list.reduce<Record<string, typeof list>>((acc, r) => {
    const key = r.topic_group ?? "Sin grupo"
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header animate-fade-in-up">
          <div className="page-header-icon">
            <Image src="/questionnaries.svg" alt="" width={36} height={36} className="h-9 w-9" />
          </div>
          <h1 className="page-title">Cuestionarios</h1>
        </div>
        <Link
          href="/teacher/class-dashboard/questionnaires/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nuevo cuestionario
        </Link>
      </div>

      <QuestionnaireList grouped={grouped} allQuestionnaires={list} questionCounts={questionCounts} />
    </div>
  )
}
