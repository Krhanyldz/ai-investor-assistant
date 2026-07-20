begin;
select plan(7);
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) values
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','00000000-0000-0000-0000-000000000000','authenticated','authenticated','watch-a@example.com','test',now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
('ffffffff-ffff-ffff-ffff-ffffffffffff','00000000-0000-0000-0000-000000000000','authenticated','authenticated','watch-b@example.com','test',now(),'{"provider":"email","providers":["email"]}','{}',now(),now());
select is((select count(*)::integer from pg_policies where tablename='watchlist_items'),3,'three ownership policies');
set local role authenticated;
select set_config('request.jwt.claim.sub','eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',true);
select set_config('request.jwt.claim.role','authenticated',true);
select lives_ok($$insert into public.watchlist_items(user_id,symbol) values('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','AAPL')$$,'user adds own item');
select throws_ok($$insert into public.watchlist_items(user_id,symbol) values('ffffffff-ffff-ffff-ffff-ffffffffffff','MSFT')$$,'42501',null,'cross-user insert blocked');
select throws_ok($$insert into public.watchlist_items(symbol) values('BAD!')$$,'23514',null,'invalid symbol blocked');
reset role;
insert into public.watchlist_items(user_id,symbol) values('ffffffff-ffff-ffff-ffff-ffffffffffff','MSFT');
set local role authenticated;
select set_config('request.jwt.claim.sub','eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',true);
select is((select count(*)::integer from public.watchlist_items),1,'other items hidden');
delete from public.watchlist_items where symbol='MSFT';
reset role;
select is((select count(*)::integer from public.watchlist_items where symbol='MSFT'),1,'cross-user delete blocked');
set local role authenticated;
select set_config('request.jwt.claim.sub','eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',true);
select lives_ok($$delete from public.watchlist_items where symbol='AAPL'$$,'user deletes own item');
reset role;
select * from finish();
rollback;
