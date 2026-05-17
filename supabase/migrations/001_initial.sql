-- Organizations (multi-tenant)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text not null default 'starter',
  created_at timestamptz not null default now()
);

-- Stores
create table stores (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  industry text not null,
  region text not null,
  seats int,
  price_range text,
  open_time time,
  close_time time,
  created_at timestamptz not null default now()
);
create index stores_org_id_idx on stores(org_id);

-- Profiles (linked to Supabase Auth)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  store_id uuid references stores(id) on delete set null,
  name text not null,
  role text not null check (role in ('hq', 'sv', 'manager', 'staff'))
);

-- Daily operation logs
create table daily_logs (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  date date not null,
  author_id uuid not null references profiles(id),
  handover_note text not null default '',
  memo text not null default '',
  created_at timestamptz not null default now(),
  unique (store_id, date)
);
create index daily_logs_store_date_idx on daily_logs(store_id, date desc);

-- Incidents (linked to daily logs)
create table incidents (
  id uuid primary key default gen_random_uuid(),
  log_id uuid not null references daily_logs(id) on delete cascade,
  type text not null check (type in ('complaint', 'shortage', 'delay', 'equipment', 'other')),
  description text not null
);
create index incidents_log_id_idx on incidents(log_id);

-- Sales data
create table sales_data (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  date date not null,
  total_sales integer not null,
  customer_count integer not null default 0,
  avg_spend integer not null default 0,
  unique (store_id, date)
);
create index sales_data_store_date_idx on sales_data(store_id, date desc);

-- Labor data
create table labor_data (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  date date not null,
  scheduled_hours numeric(5,2) not null default 0,
  actual_hours numeric(5,2) not null default 0,
  labor_cost integer not null default 0,
  labor_cost_ratio numeric(5,2) not null default 0,
  unique (store_id, date)
);
create index labor_data_store_date_idx on labor_data(store_id, date desc);

-- Improvement tasks
create table tasks (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  title text not null,
  category text not null,
  assignee_id uuid references profiles(id) on delete set null,
  due_date date,
  status text not null default 'open' check (status in ('open', 'in_progress', 'done')),
  result text,
  created_at timestamptz not null default now()
);
create index tasks_store_id_idx on tasks(store_id);
create index tasks_org_id_idx on tasks(org_id);

-- Customers
create table customers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  name text,
  phone_hash text,
  visit_count integer not null default 0,
  last_visit date,
  total_spend integer not null default 0,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index customers_store_id_idx on customers(store_id);

-- Row Level Security
alter table organizations enable row level security;
alter table stores enable row level security;
alter table profiles enable row level security;
alter table daily_logs enable row level security;
alter table incidents enable row level security;
alter table sales_data enable row level security;
alter table labor_data enable row level security;
alter table tasks enable row level security;
alter table customers enable row level security;
