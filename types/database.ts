export interface Teacher {
  id: string
  name: string
  access_code: string
  created_at: string
}

export interface Student {
  id: string
  teacher_id: string
  name: string
  access_code: string
  avatar_url: string | null
  custom_fields: Record<string, string>
  created_at: string
}

export interface Resource {
  id: string
  teacher_id: string
  title: string
  description: string | null
  topic_group: string | null
  external_links: { label: string; url: string }[]
  created_at: string
  updated_at: string
}

export interface AgendaEvent {
  id: string
  teacher_id: string
  title: string
  description: string | null
  event_date: string
  created_at: string
}

export interface DifficultWord {
  id: string
  student_id: string
  word: string
  pronunciation: string | null
  meaning: string | null
  created_at: string
}

export interface QuestionnaireStat {
  id: string
  student_id: string
  correct_answers: number
  total_answers: number
  completed_questionnaires: number
  updated_at: string
}
