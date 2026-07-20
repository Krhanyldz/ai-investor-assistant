create table public.portfolio_positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  symbol text not null,
  quantity numeric(20, 8) not null,
  average_cost numeric(20, 4) not null,
  currency text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolio_positions_symbol_format check (symbol = upper(symbol) and symbol ~ '^[A-Z0-9.-]{1,15}$'),
  constraint portfolio_positions_quantity_range check (quantity > 0 and quantity <= 1000000000000),
  constraint portfolio_positions_average_cost_range check (average_cost > 0 and average_cost <= 1000000000000),
  constraint portfolio_positions_currency_format check (currency ~ '^[A-Z]{3}$'),
  constraint portfolio_positions_user_symbol_currency_key unique (user_id, symbol, currency)
);

alter table public.portfolio_positions enable row level security;
alter table public.portfolio_positions force row level security;

create policy portfolio_positions_select_own on public.portfolio_positions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy portfolio_positions_insert_own on public.portfolio_positions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy portfolio_positions_delete_own on public.portfolio_positions
  for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on table public.portfolio_positions from public, anon, authenticated;
grant select, insert, delete on table public.portfolio_positions to authenticated;
