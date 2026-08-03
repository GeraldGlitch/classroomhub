-- ============================================================
-- ClassroomHub - Licencias Admin Panel
-- Migración completa. Correr en Supabase SQL Editor.
-- Ejecutar de arriba hacia abajo (idempotente).
-- ============================================================

-- ------------------------------------------------------------
-- 1) Helper is_admin() — usable en RLS y en servidor
--    plpgsql (no sql) para que la validación del cuerpo sea en
--    ejecución y no al crear; así puede referenciar public.admins
--    que se define más abajo en este mismo script.
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
stable
as $$
begin
  return exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
end $$;

grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------------
-- 2) Tabla admins (allowlist de administradores)
-- ------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  created_by uuid references public.admins(user_id) on delete set null
);

alter table public.admins enable row level security;

drop policy if exists "admins_self_read" on public.admins;
create policy "admins_self_read" on public.admins
  for select using (auth.uid() = user_id);

drop policy if exists "admins_admin_all" on public.admins;
create policy "admins_admin_all" on public.admins
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- 3) Tipos enum para licencias
-- ------------------------------------------------------------
do $$ begin
  create type public.license_status as enum ('active', 'suspended', 'expired', 'revoked');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.license_type as enum ('app_only', 'full');
exception when duplicate_object then null;
end $$;

-- ------------------------------------------------------------
-- 4) Tabla licenses
-- ------------------------------------------------------------
create table if not exists public.licenses (
  id                  uuid primary key default gen_random_uuid(),
  teacher_id          uuid not null references public.teachers(id) on delete cascade,
  license_key         text not null unique,
  license_type        public.license_type not null default 'app_only',
  status              public.license_status not null default 'active',
  expires_at          timestamptz null,
  notes               text null,
  max_devices         int not null default 1 check (max_devices between 1 and 20),
  last_validation_at  timestamptz null,
  last_ip             text null,
  last_device         text null,
  hardware_id         text null,
  revoked_at          timestamptz null,
  revoked_reason      text null,
  created_by          uuid references public.admins(user_id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_licenses_teacher_id   on public.licenses(teacher_id);
create index if not exists idx_licenses_status        on public.licenses(status);
create index if not exists idx_licenses_type          on public.licenses(license_type);
create index if not exists idx_licenses_expires_at    on public.licenses(expires_at);
create index if not exists idx_licenses_created_at    on public.licenses(created_at desc);

alter table public.licenses enable row level security;

drop policy if exists "licenses_admin_all" on public.licenses;
create policy "licenses_admin_all" on public.licenses
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- 5) Tabla license_events (historial / auditoría)
-- ------------------------------------------------------------
create table if not exists public.license_events (
  id           uuid primary key default gen_random_uuid(),
  license_id   uuid not null references public.licenses(id) on delete cascade,
  actor_id     uuid references public.admins(user_id) on delete set null,
  action       text not null check (action in (
                 'created','updated','status_changed','key_regenerated',
                 'revoked','reactivated','suspended','expired','deleted'
               )),
  from_status  public.license_status null,
  to_status    public.license_status null,
  metadata     jsonb null,
  created_at   timestamptz not null default now()
);

create index if not exists idx_events_license_id on public.license_events(license_id, created_at desc);
create index if not exists idx_events_action      on public.license_events(action);

alter table public.license_events enable row level security;

drop policy if exists "events_admin_all" on public.license_events;
create policy "events_admin_all" on public.license_events
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------
-- 6) Trigger updated_at en licenses
-- ------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_licenses_touch on public.licenses;
create trigger trg_licenses_touch
  before update on public.licenses
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- 7) Función get_teachers_for_admin() — expone email sin abrir auth.users
--    Devuelve lista vacía si el llamador NO es admin (fail-closed).
-- ------------------------------------------------------------
create or replace function public.get_teachers_for_admin()
returns table (teacher_id uuid, teacher_name text, email text)
language sql
security definer
stable
as $$
  select t.id, t.name, u.email
  from public.teachers t
  join auth.users u on u.id = t.id
  where public.is_admin();
$$;

grant execute on function public.get_teachers_for_admin() to authenticated;

-- ------------------------------------------------------------
-- 8) Función mark_expired_licenses() — cron diario o manual
-- ------------------------------------------------------------
create or replace function public.mark_expired_licenses()
returns int
language plpgsql
security definer
as $$
declare
  r record;
  updated_count int := 0;
begin
  for r in (
    select id, status
    from public.licenses
    where status in ('active', 'suspended')
      and expires_at is not null
      and expires_at < now()
    for update
  ) loop
    update public.licenses
      set status = 'expired'
      where id = r.id;

    insert into public.license_events (license_id, actor_id, action, from_status, to_status)
      values (r.id, null, 'expired', r.status, 'expired');

    updated_count := updated_count + 1;
  end loop;

  return updated_count;
end $$;

grant execute on function public.mark_expired_licenses() to authenticated;

-- Schedule diario (requiere extensión pg_cron habilitada en Supabase).
-- Descomentar tras confirmar que pg_cron existe:
-- select cron.schedule('mark-expired-licenses', '0 3 * * *', $$ select public.mark_expired_licenses(); $$);

-- ------------------------------------------------------------
-- 8b) Función validate_license() — validación desde la desktop app
--     Fail-closed: key inexistente → valid=false. Solo devuelve
--     resultado, nunca expone la tabla. La desktop usa anon key.
-- ------------------------------------------------------------
create or replace function public.validate_license(
  p_license_key text,
  p_device_id   text,
  p_device_name text default null,
  p_hardware_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  l record;
begin
  select * into l
  from public.licenses
  where license_key = upper(p_license_key)
  limit 1;

  if l is null then
    return jsonb_build_object(
      'valid', false,
      'status', 'invalid',
      'message', 'Licencia no encontrada'
    );
  end if;

  if l.status = 'revoked' then
    return jsonb_build_object('valid', false, 'status', 'revoked', 'message', 'Licencia revocada');
  end if;

  if l.status = 'suspended' then
    return jsonb_build_object('valid', false, 'status', 'suspended', 'message', 'Licencia suspendida');
  end if;

  if l.expires_at is not null and l.expires_at < now() then
    update public.licenses
      set status = 'expired'
      where id = l.id;
    return jsonb_build_object('valid', false, 'status', 'expired', 'message', 'Licencia expirada');
  end if;

  if l.status = 'expired' then
    return jsonb_build_object('valid', false, 'status', 'expired', 'message', 'Licencia expirada');
  end if;

  update public.licenses
    set last_validation_at = now(),
        last_device       = coalesce(p_device_name, last_device),
        hardware_id       = coalesce(p_hardware_id, hardware_id)
    where id = l.id;

  return jsonb_build_object(
    'valid',        true,
    'status',       l.status,
    'license_type', l.license_type,
    'expires_at',   l.expires_at,
    'max_devices',  l.max_devices,
    'message',      'Licencia válida'
  );
end $$;

grant execute on function public.validate_license(text, text, text, text) to anon;
grant execute on function public.validate_license(text, text, text, text) to authenticated;

-- ------------------------------------------------------------
-- 9) Bootstrap: AÑADE A TU USUARIO COMO PRIMER ADMIN
--    Reemplaza '<UID_DE_SUPABASE_AUTH>' por tu user id de Supabase Auth.
--    Hasta que exista un admin, NADIE puede entrar al panel.
-- ------------------------------------------------------------
insert into public.admins (user_id)
values ('e2f7d43b-d9d4-4f74-b30b-4b70730934f4')
on conflict (user_id) do nothing;
