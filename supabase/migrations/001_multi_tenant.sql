-- ============================================================
-- Ignitera OS v2 — マルチテナント対応マイグレーション
-- Supabase SQL Editor で実行してください
-- ============================================================

-- 1. orgs テーブル
create table if not exists orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text not null default 'free',
  created_at timestamptz not null default now()
);

-- 2. profiles テーブル（まだなければ作成）
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references orgs(id),
  store_id uuid,
  name text not null default '',
  role text not null default 'hq',
  created_at timestamptz not null default now()
);

-- 3. stores テーブル（まだなければ作成）
create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  name text not null,
  industry text not null default 'other',
  region text not null default '',
  seats integer not null default 0,
  price_range text not null default '',
  open_time text not null default '11:00',
  close_time text not null default '23:00',
  created_at timestamptz not null default now()
);

-- 4. RLS 有効化
alter table orgs enable row level security;
alter table profiles enable row level security;
alter table stores enable row level security;

-- 5. RLS ポリシー: orgs
create policy "orgs: own org only" on orgs
  for all using (
    id in (select org_id from profiles where id = auth.uid())
  );

-- 6. RLS ポリシー: profiles
create policy "profiles: own profile only" on profiles
  for all using (id = auth.uid());

-- 7. RLS ポリシー: stores
create policy "stores: own org only" on stores
  for all using (
    org_id in (select org_id from profiles where id = auth.uid())
  );

-- 8. 既存テーブルへの RLS（ある場合）

-- sales_data
alter table if exists sales_data enable row level security;
drop policy if exists "sales_data: own org only" on sales_data;
create policy "sales_data: own org only" on sales_data
  for all using (
    store_id in (
      select id from stores
      where org_id in (select org_id from profiles where id = auth.uid())
    )
  );

-- labor_data
alter table if exists labor_data enable row level security;
drop policy if exists "labor_data: own org only" on labor_data;
create policy "labor_data: own org only" on labor_data
  for all using (
    store_id in (
      select id from stores
      where org_id in (select org_id from profiles where id = auth.uid())
    )
  );

-- daily_logs
alter table if exists daily_logs enable row level security;
drop policy if exists "daily_logs: own org only" on daily_logs;
create policy "daily_logs: own org only" on daily_logs
  for all using (
    store_id in (
      select id from stores
      where org_id in (select org_id from profiles where id = auth.uid())
    )
  );

-- tasks
alter table if exists tasks enable row level security;
drop policy if exists "tasks: own org only" on tasks;
create policy "tasks: own org only" on tasks
  for all using (
    org_id in (select org_id from profiles where id = auth.uid())
  );

-- customers
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  name text not null,
  phone_hash text not null default '',
  visit_count integer not null default 0,
  last_visit date,
  total_spend integer not null default 0,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table customers enable row level security;
drop policy if exists "customers: own org only" on customers;
create policy "customers: own org only" on customers
  for all using (
    store_id in (
      select id from stores
      where org_id in (select org_id from profiles where id = auth.uid())
    )
  );
