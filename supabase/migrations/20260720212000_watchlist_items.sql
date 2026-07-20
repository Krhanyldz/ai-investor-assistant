create table public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  symbol text not null,
  created_at timestamptz not null default now(),
  constraint watchlist_items_symbol_format check (symbol = upper(symbol) and symbol ~ '^[A-Z0-9.-]{1,15}$'),
  constraint watchlist_items_user_symbol_key unique (user_id, symbol)
);
alter table public.watchlist_items enable row level security;
alter table public.watchlist_items force row level security;
create policy watchlist_items_select_own on public.watchlist_items for select to authenticated using ((select auth.uid()) = user_id);
create policy watchlist_items_insert_own on public.watchlist_items for insert to authenticated with check ((select auth.uid()) = user_id);
create policy watchlist_items_delete_own on public.watchlist_items for delete to authenticated using ((select auth.uid()) = user_id);
revoke all on table public.watchlist_items from public, anon, authenticated;
grant select, insert, delete on table public.watchlist_items to authenticated;
