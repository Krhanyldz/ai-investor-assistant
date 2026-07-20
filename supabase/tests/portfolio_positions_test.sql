begin;

select plan(11);

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'portfolio-a@example.com', 'test', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'portfolio-b@example.com', 'test', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now());

select is((select count(*)::integer from pg_policies where schemaname = 'public' and tablename = 'portfolio_positions'), 3, 'portfolio positions has three ownership policies');

set local role authenticated;
select set_config('request.jwt.claim.sub', 'cccccccc-cccc-cccc-cccc-cccccccccccc', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select lives_ok($$insert into public.portfolio_positions (user_id, symbol, quantity, average_cost, currency) values ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'AAPL', 2.5, 180, 'USD')$$, 'user can add own position');
select is((select count(*)::integer from public.portfolio_positions), 1, 'user sees own position');
select throws_ok($$insert into public.portfolio_positions (user_id, symbol, quantity, average_cost, currency) values ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'MSFT', 1, 400, 'USD')$$, '42501', null, 'user cannot add another user position');
select throws_ok($$insert into public.portfolio_positions (symbol, quantity, average_cost, currency) values ('BAD!', 1, 1, 'USD')$$, '23514', null, 'invalid symbol is rejected');
select throws_ok($$insert into public.portfolio_positions (symbol, quantity, average_cost, currency) values ('ZERO', 0, 1, 'USD')$$, '23514', null, 'zero quantity is rejected');
select throws_ok($$insert into public.portfolio_positions (symbol, quantity, average_cost, currency) values ('NEG', 1, -1, 'USD')$$, '23514', null, 'negative cost is rejected');

reset role;
insert into public.portfolio_positions (user_id, symbol, quantity, average_cost, currency) values ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'MSFT', 1, 400, 'USD');

set local role authenticated;
select set_config('request.jwt.claim.sub', 'cccccccc-cccc-cccc-cccc-cccccccccccc', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select is((select count(*)::integer from public.portfolio_positions), 1, 'other user positions are hidden');
delete from public.portfolio_positions where symbol = 'MSFT';
reset role;
select is((select count(*)::integer from public.portfolio_positions where symbol = 'MSFT'), 1, 'user cannot delete another user position');

set local role authenticated;
select set_config('request.jwt.claim.sub', 'cccccccc-cccc-cccc-cccc-cccccccccccc', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select lives_ok($$delete from public.portfolio_positions where symbol = 'AAPL'$$, 'user can delete own position');
select is((select count(*)::integer from public.portfolio_positions), 0, 'own position was deleted');

reset role;
select * from finish();
rollback;
