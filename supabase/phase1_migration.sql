create table if not exists pending_stud_submissions (
  id uuid primary key default gen_random_uuid(),
  dog_name text not null,
  breed text not null,
  sex text not null default 'male',
  age int,
  dob date,
  color_traits text not null,
  city text not null,
  state text not null,
  stud_fee numeric(10,2),
  owner_name text not null,
  phone_number text not null,
  email text not null,
  description text not null,
  akc_status text,
  health_testing text,
  chilled_semen_available boolean default false,
  photos text[] default '{}',
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  featured boolean default false,
  verified boolean default false,
  edit_token text not null unique default encode(gen_random_bytes(32), 'hex'),
  source text not null default 'organic' check (source in ('manual','organic','outreach')),
  ownership_confirmed boolean not null default false,
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_pending_submissions_status on pending_stud_submissions(status);
create index if not exists idx_pending_submissions_edit_token on pending_stud_submissions(edit_token);
create index if not exists idx_pending_submissions_breed on pending_stud_submissions(breed);

-- RLS: public cannot read (admin only via service role)
alter table pending_stud_submissions enable row level security;
-- No public policies — all access via service role key only

-- Tracking events table
create table if not exists listing_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  listing_id uuid,
  submission_id uuid,
  metadata jsonb,
  ip_address text,
  created_at timestamptz default now()
);

create index if not exists idx_listing_events_type on listing_events(event_type);
create index if not exists idx_listing_events_listing on listing_events(listing_id);
