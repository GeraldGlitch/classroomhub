-- =====================================================
-- Migration v2: Roleplays
-- =====================================================
-- Adds tables for roleplay dialogues shared with the class.
-- A roleplay is a script of lines, each attributed to an
-- actor (e.g. "Anna", "Shopkeeper"). The student portal
-- paginates the lines client-side for readability.
-- =====================================================

-- Roleplay scripts
CREATE TABLE roleplays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  topic_group TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Individual lines of a roleplay
CREATE TABLE roleplay_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roleplay_id UUID NOT NULL REFERENCES roleplays(id) ON DELETE CASCADE,
  actor_name TEXT NOT NULL,
  line_text TEXT NOT NULL,
  line_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX roleplay_lines_roleplay_id_idx ON roleplay_lines (roleplay_id, line_order);

-- Enable RLS
ALTER TABLE roleplays ENABLE ROW LEVEL SECURITY;
ALTER TABLE roleplay_lines ENABLE ROW LEVEL SECURITY;

-- Teachers: full access to their own roleplays
CREATE POLICY "roleplays_teacher_all" ON roleplays
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "roleplay_lines_teacher_all" ON roleplay_lines
  FOR ALL USING (
    auth.uid() = (SELECT teacher_id FROM roleplays WHERE id = roleplay_id)
  );

-- Students: public read access (filtered in queries by teacher_id cookie)
CREATE POLICY "roleplays_public_read" ON roleplays
  FOR SELECT USING (true);

CREATE POLICY "roleplay_lines_public_read" ON roleplay_lines
  FOR SELECT USING (true);
