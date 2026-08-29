-- ============================================================
-- ClassroomHub - Hearts v2: historial individual de corazones
-- Migración: tabla heart_credits (1 fila = 1 corazón pagado).
-- Correr en Supabase SQL Editor (idempotente).
-- La desktop app es la fuente de verdad; esta tabla la refleja.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Tabla heart_credits
--    status: active = disponible, consumed = recibió la clase,
--    removed = quitado manualmente por el profesor.
--    Sin expiración automática (regla de negocio).
-- ------------------------------------------------------------
create table if not exists public.heart_credits (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references public.students(id) on delete cascade,
  status       text not null default 'active'
                 check (status in ('active', 'consumed', 'removed')),
  package_id   uuid references public.packages(id) on delete set null,
  package_name text not null default '',
  source       text not null default 'manual',
  actor        text not null default '',
  acquired_at  timestamptz not null default now(),
  consumed_at  timestamptz,
  removed_at   timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_heart_credits_student_id on public.heart_credits(student_id);

alter table public.heart_credits enable row level security;

-- Profesor (auth.uid() = teacher dueño del estudiante): control total
drop policy if exists "heart_credits_teacher_all" on public.heart_credits;
create policy "heart_credits_teacher_all" on public.heart_credits
  for all
  using (exists (select 1 from public.students s
                 where s.id = student_id and s.teacher_id = auth.uid()))
  with check (exists (select 1 from public.students s
                 where s.id = student_id and s.teacher_id = auth.uid()));

-- Lectura pública para el portal (cookie-auth, mismo patrón que packages)
-- El estudiante NO puede insertar/actualizar/borrar (no hay policy que lo permita).
drop policy if exists "heart_credits_public_select" on public.heart_credits;
create policy "heart_credits_public_select" on public.heart_credits
  for select using (true);

-- ------------------------------------------------------------
-- 2) Trigger updated_at (función touch_updated_at ya existe)
-- ------------------------------------------------------------
drop trigger if exists trg_heart_credits_touch on public.heart_credits;
create trigger trg_heart_credits_touch
  before update on public.heart_credits
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- 3) Backfill OPCIONAL (solo si se quiere historial sin re-sync
--    desde la desktop app): convierte balances existentes en
--    créditos legacy. Correr UNA sola vez manualmente.
-- ------------------------------------------------------------
-- insert into public.heart_credits (student_id, status, package_name, source, acquired_at)
-- select s.id, 'active', 'Legacy balance', 'legacy', now()
-- from public.students s
-- where s.hearts_balance > 0
-- cross join lateral generate_series(1, floor(s.hearts_balance)::int);