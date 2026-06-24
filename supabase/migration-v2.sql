-- Reading stats per student (used for the Palabras Difíciles progress bar)
CREATE TABLE word_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE UNIQUE,
  mispronounced_count INTEGER DEFAULT 0,
  total_read_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE word_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "word_stats_teacher_all" ON word_stats
  FOR ALL USING (auth.uid() = (SELECT teacher_id FROM students WHERE id = student_id));
CREATE POLICY "word_stats_student_read" ON word_stats
  FOR SELECT USING (true);
