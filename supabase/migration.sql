-- ClassroomHub Schema

-- Teachers (extends Supabase auth.users)
CREATE TABLE teachers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  access_code TEXT NOT NULL UNIQUE DEFAULT substr(md5(random()::text), 1, 6),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Students per teacher (each has a unique access code)
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  access_code TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Resources shared with class
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  topic_group TEXT,
  external_links JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Agenda events
CREATE TABLE agenda_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Difficult words per student
CREATE TABLE difficult_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  pronunciation TEXT,
  meaning TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Questionnaire stats per student
CREATE TABLE questionnaire_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE UNIQUE,
  correct_answers INTEGER DEFAULT 0,
  total_answers INTEGER DEFAULT 0,
  completed_questionnaires INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create teacher row on auth signup
CREATE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.teachers (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'name', new.email));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE difficult_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Teachers can read/write own data
CREATE POLICY "teachers_own" ON teachers
  FOR ALL USING (auth.uid() = id);

-- Students: teachers can CRUD; unauthenticated read by access_code for login
CREATE POLICY "students_teacher_all" ON students
  FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "students_read_by_code" ON students
  FOR SELECT USING (true);

-- Resources: teacher CRUD, student read (if same teacher)
CREATE POLICY "resources_teacher_all" ON resources
  FOR ALL USING (auth.uid() = teacher_id);

-- Agenda: teacher CRUD, student read
CREATE POLICY "agenda_teacher_all" ON agenda_events
  FOR ALL USING (auth.uid() = teacher_id);

-- Difficult words: teacher CRUD, student read own
CREATE POLICY "words_teacher_all" ON difficult_words
  FOR ALL USING (auth.uid() = (SELECT teacher_id FROM students WHERE id = student_id));
CREATE POLICY "words_student_read" ON difficult_words
  FOR SELECT USING (true); -- filtered in query

-- Questionnaire stats: teacher CRUD, student read own
CREATE POLICY "stats_teacher_all" ON questionnaire_stats
  FOR ALL USING (auth.uid() = (SELECT teacher_id FROM students WHERE id = student_id));
CREATE POLICY "stats_student_read" ON questionnaire_stats
  FOR SELECT USING (true); -- filtered in query
