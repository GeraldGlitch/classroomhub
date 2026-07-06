-- Questionnaire System Tables (Phase 1)
-- Add after existing tables in a new section

CREATE TABLE questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  topic_group TEXT,
  cooldown_minutes INTEGER DEFAULT 30,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE questionnaire_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('single', 'multiple')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE questionnaire_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questionnaire_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE questionnaire_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  percentage NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE questionnaire_attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES questionnaire_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questionnaire_questions(id) ON DELETE CASCADE,
  selected_options UUID[] NOT NULL DEFAULT '{}',
  is_correct BOOLEAN DEFAULT false
);

-- RLS Policies

ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_attempt_answers ENABLE ROW LEVEL SECURITY;

-- Teacher: full CRUD on own questionnaires
CREATE POLICY "questionnaires_teacher_all" ON questionnaires
  FOR ALL USING (auth.uid() = teacher_id);

-- Public read on published questionnaires (student cookie-based access)
CREATE POLICY "questionnaires_public_read" ON questionnaires
  FOR SELECT USING (published = true);

-- Questions: teacher CRUD via questionnaire ownership
CREATE POLICY "questions_teacher_all" ON questionnaire_questions
  FOR ALL USING (auth.uid() = (SELECT teacher_id FROM questionnaires WHERE id = questionnaire_id));

-- Questions: public read for published questionnaires
CREATE POLICY "questions_public_read" ON questionnaire_questions
  FOR SELECT USING (
    (SELECT published FROM questionnaires WHERE id = questionnaire_id) = true
  );

-- Options: teacher CRUD via question -> questionnaire ownership
CREATE POLICY "options_teacher_all" ON questionnaire_options
  FOR ALL USING (
    auth.uid() = (
      SELECT q2.teacher_id FROM questionnaire_questions q1
      JOIN questionnaires q2 ON q2.id = q1.questionnaire_id
      WHERE q1.id = question_id
    )
  );

-- Options: public read for published questionnaires
CREATE POLICY "options_public_read" ON questionnaire_options
  FOR SELECT USING (
    (SELECT q.published FROM questionnaire_questions qj
     JOIN questionnaires q ON q.id = qj.questionnaire_id
     WHERE qj.id = question_id) = true
  );

-- Attempts: public insert + update + select (student cookie-based)
-- Auth enforcement happens in Server Action (cookie student_id check)
CREATE POLICY "attempts_public_insert" ON questionnaire_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "attempts_public_update" ON questionnaire_attempts
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "attempts_public_select" ON questionnaire_attempts
  FOR SELECT USING (true);

-- Attempt answers: public insert + select
CREATE POLICY "attempt_answers_public_insert" ON questionnaire_attempt_answers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "attempt_answers_public_select" ON questionnaire_attempt_answers
  FOR SELECT USING (true);

-- Teacher: read attempts for own questionnaires' students
CREATE POLICY "attempts_teacher_read" ON questionnaire_attempts
  FOR SELECT USING (
    auth.uid() = (
      SELECT teacher_id FROM questionnaires WHERE id = questionnaire_id
    )
  );
