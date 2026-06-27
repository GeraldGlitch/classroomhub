-- ClassroomHub v2 Migration
-- Adds: readings table + RLS policies

-- Readings (paragraphs for student reading practice)
CREATE TABLE readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  topic_group TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "readings_teacher_all" ON readings
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "readings_public_read" ON readings
  FOR SELECT USING (true); -- filtered in query by teacher_id
