create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_key unique (email),
  constraint profiles_email_not_blank check (btrim(email) <> ''),
  constraint profiles_display_name_reasonable check (
    display_name is null
    or (
      display_name = btrim(display_name)
      and char_length(display_name) between 1 and 80
    )
  )
);

alter table public.profiles
  add column if not exists email text,
  add column if not exists display_name text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update public.profiles as profiles
set
  email = users.email,
  display_name = nullif(btrim(profiles.display_name), ''),
  updated_at = coalesce(profiles.updated_at, now())
from auth.users as users
where profiles.id = users.id
  and (
    profiles.email is distinct from users.email
    or profiles.display_name is distinct from nullif(btrim(profiles.display_name), '')
    or profiles.updated_at is null
  );

insert into public.profiles (id, email, display_name, created_at, updated_at)
select
  users.id,
  users.email,
  nullif(btrim(users.raw_user_meta_data ->> 'display_name'), ''),
  coalesce(users.created_at, now()),
  now()
from auth.users as users
where users.email is not null
on conflict (id) do update
set
  email = excluded.email,
  updated_at = now()
where public.profiles.email is distinct from excluded.email;

alter table public.profiles
  alter column id set not null,
  alter column email set not null,
  alter column created_at set not null,
  alter column created_at set default now(),
  alter column updated_at set not null,
  alter column updated_at set default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_pkey'
  ) then
    alter table public.profiles
      add constraint profiles_pkey primary key (id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_id_fkey
      foreign key (id) references auth.users(id) on delete cascade;
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_email_key'
  ) then
    alter table public.profiles
      add constraint profiles_email_key unique (email);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_email_not_blank'
  ) then
    alter table public.profiles
      add constraint profiles_email_not_blank
      check (btrim(email) <> '');
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_display_name_reasonable'
  ) then
    alter table public.profiles
      add constraint profiles_display_name_reasonable
      check (
        display_name is null
        or (
          display_name = btrim(display_name)
          and char_length(display_name) between 1 and 80
        )
      );
  end if;
end;
$$;

create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is null then
    return new;
  end if;

  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    nullif(btrim(new.raw_user_meta_data ->> 'display_name'), '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    updated_at = now()
  where public.profiles.email is distinct from excluded.email;

  return new;
end;
$$;

create or replace function public.sync_profile_email_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is null then
    return new;
  end if;

  update public.profiles
  set
    email = new.email,
    updated_at = now()
  where id = new.id
    and email is distinct from new.email;

  return new;
end;
$$;

create or replace function public.set_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.handle_new_auth_user_profile() from public, anon, authenticated;
revoke all on function public.sync_profile_email_from_auth_user() from public, anon, authenticated;
revoke all on function public.set_profile_updated_at() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user_profile();

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.sync_profile_email_from_auth_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_profile_updated_at();

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_update_own_display_name on public.profiles;

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy profiles_update_own_display_name
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

revoke all on table public.profiles from public, anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name) on table public.profiles to authenticated;
