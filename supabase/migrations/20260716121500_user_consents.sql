create table if not exists public.user_consents (
  user_id uuid not null references auth.users(id) on delete cascade,
  version text not null,
  accepted_at timestamptz not null default now(),
  constraint user_consents_pkey primary key (user_id, version),
  constraint user_consents_version_not_blank check (btrim(version) <> ''),
  constraint user_consents_version_length check (char_length(version) <= 120)
);

alter table public.user_consents
  alter column accepted_at set default now();

create or replace function public.accept_current_user_consent(consent_version text)
returns table(version text, accepted_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_version text := btrim(consent_version);
begin
  if current_user_id is null then
    raise exception 'Authentication required to accept consent.';
  end if;

  if normalized_version is null or normalized_version = '' or char_length(normalized_version) > 120 then
    raise exception 'Consent version is invalid.';
  end if;

  insert into public.user_consents (user_id, version)
  values (current_user_id, normalized_version)
  on conflict on constraint user_consents_pkey do nothing;

  return query
  select user_consents.version, user_consents.accepted_at
  from public.user_consents as user_consents
  where user_consents.user_id = current_user_id
    and user_consents.version = normalized_version;
end;
$$;

revoke all on function public.accept_current_user_consent(text) from public, anon, authenticated;
grant execute on function public.accept_current_user_consent(text) to authenticated;

alter table public.user_consents enable row level security;
alter table public.user_consents force row level security;

drop policy if exists user_consents_select_own on public.user_consents;

create policy user_consents_select_own
  on public.user_consents
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.user_consents from public, anon, authenticated;
grant select on table public.user_consents to authenticated;
