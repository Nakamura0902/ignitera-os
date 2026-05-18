-- Add submitted_at to daily_logs
alter table daily_logs add column if not exists submitted_at timestamptz;

-- Handovers table
create table if not exists handovers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  store_id uuid not null references stores(id) on delete cascade,
  author_id uuid not null references profiles(id),
  content text not null,
  priority text not null default 'normal' check (priority in ('high', 'normal')),
  is_confirmed bool not null default false,
  confirmed_by uuid references profiles(id),
  confirmed_at timestamptz,
  date date not null,
  created_at timestamptz not null default now()
);
create index handovers_store_date_idx on handovers(store_id, date desc);
create index handovers_org_id_idx on handovers(org_id);

alter table handovers enable row level security;

-- RLS helper: returns the org_id for the current authenticated user
create or replace function get_user_org_id()
returns uuid
language sql
stable
security definer
as $$
  select org_id from profiles where id = auth.uid()
$$;

-- organizations: members can read their own org
create policy "org_read" on organizations
  for select using (id = get_user_org_id());

-- stores: members can read stores in their org
create policy "store_read" on stores
  for select using (org_id = get_user_org_id());

-- profiles: members can read profiles in their org
create policy "profile_read" on profiles
  for select using (org_id = get_user_org_id());

create policy "profile_update_own" on profiles
  for update using (id = auth.uid());

-- daily_logs: members can read logs in their org's stores; authors can insert/update
create policy "daily_log_read" on daily_logs
  for select using (
    store_id in (select id from stores where org_id = get_user_org_id())
  );

create policy "daily_log_write" on daily_logs
  for insert with check (
    store_id in (select id from stores where org_id = get_user_org_id())
    and author_id = auth.uid()
  );

create policy "daily_log_update_own" on daily_logs
  for update using (author_id = auth.uid());

-- incidents: follow daily_log access
create policy "incident_read" on incidents
  for select using (
    log_id in (
      select id from daily_logs
      where store_id in (select id from stores where org_id = get_user_org_id())
    )
  );

create policy "incident_write" on incidents
  for insert with check (
    log_id in (
      select id from daily_logs where author_id = auth.uid()
    )
  );

-- sales_data
create policy "sales_read" on sales_data
  for select using (
    store_id in (select id from stores where org_id = get_user_org_id())
  );

create policy "sales_write" on sales_data
  for insert with check (
    store_id in (select id from stores where org_id = get_user_org_id())
  );

create policy "sales_update" on sales_data
  for update using (
    store_id in (select id from stores where org_id = get_user_org_id())
  );

-- labor_data
create policy "labor_read" on labor_data
  for select using (
    store_id in (select id from stores where org_id = get_user_org_id())
  );

create policy "labor_write" on labor_data
  for insert with check (
    store_id in (select id from stores where org_id = get_user_org_id())
  );

create policy "labor_update" on labor_data
  for update using (
    store_id in (select id from stores where org_id = get_user_org_id())
  );

-- tasks
create policy "task_read" on tasks
  for select using (org_id = get_user_org_id());

create policy "task_write" on tasks
  for insert with check (org_id = get_user_org_id());

create policy "task_update" on tasks
  for update using (org_id = get_user_org_id());

-- handovers
create policy "handover_read" on handovers
  for select using (org_id = get_user_org_id());

create policy "handover_write" on handovers
  for insert with check (
    org_id = get_user_org_id()
    and author_id = auth.uid()
  );

create policy "handover_confirm" on handovers
  for update using (org_id = get_user_org_id());

-- customers
create policy "customer_read" on customers
  for select using (
    store_id in (select id from stores where org_id = get_user_org_id())
  );
