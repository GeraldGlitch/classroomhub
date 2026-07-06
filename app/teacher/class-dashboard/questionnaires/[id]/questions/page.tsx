import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import QuestionEditor from "./QuestionEditor"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function QuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: questionnaire } = await supabase
    .from("questionnaires")
    .select("id, title, published")
    .eq("id", id)
    .single()

  if (!questionnaire) notFound()

  const { data: questions } = await supabase
    .from("questionnaire_questions")
    .select("id, question_text, question_type, sort_order")
    .eq("questionnaire_id", id)
    .order("sort_order", { ascending: true })

  const questionsList = questions ?? []

  const optionsByQuestion: Record<string, { id: string; option_text: string; is_correct: boolean; sort_order: number }[]> = {}
  for (const q of questionsList) {
    const { data: opts } = await supabase
      .from("questionnaire_options")
      .select("id, option_text, is_correct, sort_order")
      .eq("question_id", q.id)
      .order("sort_order", { ascending: true })
    optionsByQuestion[q.id] = opts ?? []
  }

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = questionnaire ? true : false

  return (
    <div className="space-y-6">
      <Link
        href="/teacher/class-dashboard/questionnaires"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a cuestionarios
      </Link>

      <div className="page-header animate-fade-in-up">
        <div className="page-header-icon">
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">?</span>
        </div>
        <h1 className="page-title">{questionnaire.title}</h1>
      </div>

      <QuestionEditor
        questionnaireId={questionnaire.id}
        published={questionnaire.published}
        questions={questionsList}
        optionsByQuestion={optionsByQuestion}
      />
    </div>
  )
}
