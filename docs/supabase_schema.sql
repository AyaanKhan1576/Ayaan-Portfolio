create extension if not exists pgcrypto;

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  user_agent text,
  ip_address inet,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_event_type_created_at_idx
  on analytics_events (event_type, created_at desc);

create index if not exists analytics_events_created_at_idx
  on analytics_events (created_at desc);

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default 'Portfolio contact',
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx
  on contact_submissions (created_at desc);

create index if not exists contact_submissions_handled_created_at_idx
  on contact_submissions (handled, created_at desc);

alter table analytics_events enable row level security;
alter table contact_submissions enable row level security;

comment on table analytics_events is
  'Best-effort portfolio analytics written by the FastAPI backend with a service-role key.';

comment on table contact_submissions is
  'Portfolio contact messages written by the FastAPI backend with a service-role key.';

-- No anon/public policies are intentionally created here.
-- The frontend calls FastAPI, and FastAPI writes with the service-role key.
-- Add public policies only if you intentionally expose direct browser writes.
