-- ============================================================
-- ClassroomHub - Hearts per Class (feature opcional)
-- Migración: tabla packages + columna hearts_balance en students.
-- Correr en Supabase SQL Editor (idempotente).
-- ============================================================

-- ------------------------------------------------------------
-- 1) Columna hearts_balance en students
-- ------------------------------------------------------------
alter table public.students
  add column if not exists hearts_balance double precision not null default 0;

-- ------------------------------------------------------------
-- 2) Tabla packages
--    price es texto libre (label) para que cada profesor use
--    C$, $, etc. según convenga.
-- ------------------------------------------------------------
create table if not exists public.packages (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references public.teachers(id) on delete cascade,
  name        text not null,
  description text not null default '',
  hearts      double precision not null default 0,
  price       text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Migración para tablas ya creadas con price numérico
alter table public.packages alter column price type text using price::text;
alter table public.packages alter column price set default '';

create index if not exists idx_packages_teacher_id on public.packages(teacher_id);

alter table public.packages enable row level security;

-- Teacher puede gestionar sus propios packages
drop policy if exists "packages_teacher_all" on public.packages;
create policy "packages_teacher_all" on public.packages
  for all using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

-- Estudiantes (cookie-auth, sin Supabase auth) leen packages públicos de su teacher
-- La validación de student_id se hace en el Server Action.
drop policy if exists "packages_public_select" on public.packages;
create policy "packages_public_select" on public.packages
  for select using (true);

-- ------------------------------------------------------------
-- 3) Trigger updated_at en packages
-- ------------------------------------------------------------
drop trigger if exists trg_packages_touch on public.packages;
create trigger trg_packages_touch
  before update on public.packages
  for each row execute function public.touch_updated_at();