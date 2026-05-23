create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_event_type_created_at_idx
  on analytics_events (event_type, created_at desc);

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default 'Portfolio contact',
  message text not null,
  created_at timestamptz not null default now()
);

alter table analytics_events enable row level security;
alter table contact_submissions enable row level security;
