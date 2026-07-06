import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import QuestionnaireForm from "../../QuestionnaireForm"

export default async function EditQuestionnairePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: questionnaire } = await supabase
    .from("questionnaires")
    .select("id, title, description, instructions, topic_group, cooldown_minutes")
    .eq("id", id)
    .single()

  if (!questionnaire) notFound()

  return <QuestionnaireForm questionnaire={questionnaire} />
}
