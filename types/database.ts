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
  resource_type: string | null
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
  fail_count: number
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

export interface Admin {
  user_id: string
  created_at: string
  created_by: string | null
}

export type LicenseStatus = 'active' | 'suspended' | 'expired' | 'revoked'
export type LicenseType = 'app_only' | 'full'

export interface License {
  id: string
  teacher_id: string
  license_key: string
  license_type: LicenseType
  status: LicenseStatus
  expires_at: string | null
  notes: string | null
  max_devices: number
  last_validation_at: string | null
  last_ip: string | null
  last_device: string | null
  hardware_id: string | null
  revoked_at: string | null
  revoked_reason: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface LicenseEvent {
  id: string
  license_id: string
  actor_id: string | null
  action: string
  from_status: LicenseStatus | null
  to_status: LicenseStatus | null
  metadata: {
    fields?: { field: string; from: unknown; to: unknown }[]
    reason?: string
    regenerated_at?: string
    license_type?: LicenseType
  } | null
  created_at: string
}

export interface TeacherLookup {
  teacher_id: string
  teacher_name: string
  email: string
}
