create extension if not exists pgcrypto;

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  user_agent text,
  ip_address inet,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'analytics_events_event_type_length_chk'
  ) then
    alter table analytics_events
      add constraint analytics_events_event_type_length_chk
      check (char_length(event_type) <= 64) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'analytics_events_user_agent_length_chk'
  ) then
    alter table analytics_events
      add constraint analytics_events_user_agent_length_chk
      check (user_agent is null or char_length(user_agent) <= 180) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'analytics_events_metadata_size_chk'
  ) then
    alter table analytics_events
      add constraint analytics_events_metadata_size_chk
      check (octet_length(metadata::text) <= 2048) not valid;
  end if;
end $$;

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
  'Best-effort portfolio analytics written by server-side API routes with a service-role key. IP storage is intentionally avoided by application code.';

comment on table contact_submissions is
  'Legacy contact message storage. The current portfolio contact section uses external social/email links.';

-- No anon/public policies are intentionally created here.
-- The frontend calls FastAPI, and FastAPI writes with the service-role key.
-- Add public policies only if you intentionally expose direct browser writes.
