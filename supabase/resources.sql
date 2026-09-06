-- ============================================================
-- ClassroomHub - Resources (Browser module: Video / Slides / Docs)
-- Migración idempotente. Correr en Supabase SQL Editor.
-- La desktop app (Browser module) sincroniza aquí vía REST con
-- el token del teacher autenticado (resource_type VIDEO/SLIDE/DOC).
-- ============================================================

create table if not exists public.resources (
  id            uuid primary key default gen_random_uuid(),
  teacher_id    uuid not null references public.teachers(id) on delete cascade,
  title         text not null,
  description   text null,
  topic_group   text null,
  resource_type text not null default 'DOC',
  external_links jsonb not null default '[]'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_resources_teacher_id on public.resources(teacher_id);
create index if not exists idx_resources_resource_type on public.resources(resource_type);
create index if not exists idx_resources_topic_group on public.resources(topic_group);

alter table public.resources enable row level security;

drop policy if exists "resources_teacher_all" on public.resources;
create policy "resources_teacher_all" on public.resources
  for all using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

drop policy if exists "resources_public_read" on public.resources;
create policy "resources_public_read" on public.resources
  for select using (true);

-- Trigger updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_resources_touch on public.resources;
create trigger trg_resources_touch
  before update on public.resources
  for each row execute function public.touch_updated_at();