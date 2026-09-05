-- Agregar hora inicio/fin a agenda_events (portal web)
-- Correr esto en el SQL Editor de Supabase.

ALTER TABLE agenda_events ADD COLUMN IF NOT EXISTS start_time time;
ALTER TABLE agenda_events ADD COLUMN IF NOT EXISTS end_time time;
