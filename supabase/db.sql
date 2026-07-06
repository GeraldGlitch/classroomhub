-- Políticas RLS para progress_records (portal web)
-- La tabla ya existe en Supabase, solo se agregan las políticas necesarias
-- para que el portal web pueda insertar registros de progreso.
-- Correr esto en el SQL Editor de Supabase.

-- Habilitar RLS (si no está ya habilitado)
ALTER TABLE progress_records ENABLE ROW LEVEL SECURITY;

-- Permitir inserción pública (estudiantes usan cookie-auth, no Supabase auth)
-- La validación de student_id se hace en el Server Action
DROP POLICY IF EXISTS "progress_public_insert" ON progress_records;
CREATE POLICY "progress_public_insert" ON progress_records
  FOR INSERT WITH CHECK (true);

-- Permitir lectura pública para que estudiantes vean su progreso
DROP POLICY IF EXISTS "progress_public_select" ON progress_records;
CREATE POLICY "progress_public_select" ON progress_records
  FOR SELECT USING (true);

-- Permitir que teachers lean el progreso de sus propios estudiantes
DROP POLICY IF EXISTS "progress_teacher_read" ON progress_records;
CREATE POLICY "progress_teacher_read" ON progress_records
  FOR SELECT USING (
    auth.uid() = (
      SELECT s.teacher_id FROM students s WHERE s.id = student_id
    )
  );
