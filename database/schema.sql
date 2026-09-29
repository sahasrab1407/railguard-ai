create table assets (
  id uuid primary key default gen_random_uuid(),
  asset_id text unique not null,
  name text,
  asset_type text not null,
  location text,
  wear_pct numeric,
  vibration numeric,
  inspection_score numeric,
  last_maintenance_days integer,
  risk_score numeric default 0,
  priority text,
  created_at timestamp default now()
);

create table crews (
  id uuid primary key default gen_random_uuid(),
  crew_id text unique not null,
  name text,
  skill text not null,
  availability boolean default true,
  distance_km numeric,
  current_workload integer default 0,
  created_at timestamp default now()
);

create table work_orders (
  id uuid primary key default gen_random_uuid(),
  work_order_id text unique not null,
  asset_id uuid references assets(id),
  priority text,
  deadline timestamp,
  status text default 'open',
  assigned_crew uuid references crews(id),
  created_at timestamp default now()
);

create table maintenance_history (
  id uuid primary key default gen_random_uuid(),
  asset_id text not null,
  action text,
  date date,
  notes text
);

alter table assets enable row level security;
alter table crews enable row level security;
alter table work_orders enable row level security;
alter table maintenance_history enable row level security;

create policy "Allow all access - hackathon" on assets for all using (true) with check (true);
create policy "Allow all access - hackathon" on crews for all using (true) with check (true);
create policy "Allow all access - hackathon" on work_orders for all using (true) with check (true);
create policy "Allow all access - hackathon" on maintenance_history for all using (true) with check (true);