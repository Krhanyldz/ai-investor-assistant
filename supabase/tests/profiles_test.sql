begin;

select plan(18);

select is(
  (
    select count(*)::integer
    from pg_trigger
    where tgrelid = 'auth.users'::regclass
      and tgname = 'on_auth_user_created'
      and not tgisinternal
  ),
  1,
  'exactly one on_auth_user_created trigger exists'
);

select is(
  (
    select count(*)::integer
    from pg_trigger
    where tgrelid = 'auth.users'::regclass
      and tgname = 'on_auth_user_email_updated'
      and not tgisinternal
  ),
  1,
  'exactly one on_auth_user_email_updated trigger exists'
);

select is(
  (
    select count(*)::integer
    from pg_trigger
    where tgrelid = 'public.profiles'::regclass
      and tgname = 'set_profiles_updated_at'
      and not tgisinternal
  ),
  1,
  'exactly one set_profiles_updated_at trigger exists'
);

select is(
  (
    select array_agg(policyname order by policyname)::text
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
  ),
  '{profiles_select_own,profiles_update_own_display_name}',
  'profiles has exactly the intended RLS policies'
);

select is(
  (
    select count(*)::integer
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname in (
        'Users can view own profile',
        'Users can update own profile',
        'Users can insert own profile'
      )
  ),
  0,
  'legacy profiles RLS policies do not exist'
);

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'alice@example.com',
    'test-password',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Alice Example"}'::jsonb,
    now(),
    now()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'bob@example.com',
    'test-password',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Bob Example"}'::jsonb,
    now(),
    now()
  );

select is(
  (select count(*)::integer from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  1,
  'auth.users insert creates a profile'
);

select is(
  (select count(*)::integer from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  1,
  'there is exactly one profile for a user'
);

select is(
  (select display_name from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'Alice Example',
  'profile display_name is seeded from signup metadata'
);

update auth.users
set email = 'alice.renamed@example.com'
where id = '11111111-1111-1111-1111-111111111111';

select is(
  (select email from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'alice.renamed@example.com',
  'profile email synchronizes from auth.users email changes'
);

select is(
  (select display_name from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'Alice Example',
  'email synchronization does not overwrite display_name'
);

select is(
  (select count(*)::integer from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  1,
  'email synchronization keeps exactly one profile row'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select is(
  (select count(*)::integer from public.profiles),
  1,
  'authenticated users can select only their own profile'
);

select is(
  (select count(*)::integer from public.profiles where id = '22222222-2222-2222-2222-222222222222'),
  0,
  'authenticated users cannot select another user profile'
);

update public.profiles
set display_name = 'Alice Edited'
where id = '11111111-1111-1111-1111-111111111111';

reset role;

select is(
  (select display_name from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'Alice Edited',
  'authenticated users can update their own display_name'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

update public.profiles
set display_name = 'Cross User Edit'
where id = '11111111-1111-1111-1111-111111111111';

reset role;

select is(
  (select display_name from public.profiles where id = '11111111-1111-1111-1111-111111111111'),
  'Alice Edited',
  'authenticated users cannot update another user profile'
);

set local role anon;

select throws_ok(
  'select count(*) from public.profiles',
  '42501',
  null,
  'anonymous users cannot select profiles'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select throws_ok(
  $$update public.profiles set email = 'attacker@example.com' where id = '11111111-1111-1111-1111-111111111111'$$,
  '42501',
  null,
  'authenticated users cannot update protected profile columns'
);

select throws_ok(
  $$insert into public.profiles (id, email, display_name) values ('33333333-3333-3333-3333-333333333333', 'mallory@example.com', 'Mallory')$$,
  '42501',
  null,
  'authenticated users cannot directly insert profiles'
);

reset role;

select * from finish();

rollback;
