-- PROFILES
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  username text unique,
  city text,
  state text,
  country text default 'US',
  phone text,
  bio text,
  avatar_url text,
  role text default 'buyer' check (role in ('buyer', 'owner', 'admin')),
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- STUDS
create table if not exists studs (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  breed text not null,
  color text,
  genetics text,
  weight_lbs numeric,
  age_years numeric,
  stud_fee numeric,
  contact_for_price boolean default false,
  city text not null,
  state text,
  country text default 'US',
  is_proven boolean default false,
  health_tested boolean default false,
  health_notes text,
  akc_registered boolean default false,
  registration_type text,
  description text,
  photos text[] default '{}',
  availability text default 'available' check (availability in ('available', 'unavailable', 'limited')),
  status text default 'pending' check (status in ('active', 'pending', 'rejected', 'inactive')),
  is_featured boolean default false,
  is_boosted boolean default false,
  boost_expires_at timestamptz,
  views integer default 0,
  message_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CONVERSATIONS (one per buyer per listing)
create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  stud_id uuid references studs(id) on delete cascade not null,
  buyer_id uuid references profiles(id) on delete cascade not null,
  owner_id uuid references profiles(id) on delete cascade not null,
  last_message_at timestamptz default now(),
  last_message_preview text,
  buyer_unread integer default 0,
  owner_unread integer default 1,
  created_at timestamptz default now(),
  unique(stud_id, buyer_id)
);

-- MESSAGES
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  message_text text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- EVENT TRACKING
create table if not exists search_events (
  id uuid default gen_random_uuid() primary key,
  breed text,
  location text,
  user_id uuid,
  session_id text,
  created_at timestamptz default now()
);

create table if not exists listing_views (
  id uuid default gen_random_uuid() primary key,
  stud_id uuid references studs(id) on delete cascade,
  breed text,
  location text,
  viewer_id uuid,
  session_id text,
  created_at timestamptz default now()
);

create table if not exists message_events (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid,
  stud_id uuid,
  buyer_location text,
  breed text,
  created_at timestamptz default now()
);

-- ANALYTICS
create table if not exists demand_by_breed (
  breed text primary key,
  search_count integer default 0,
  view_count integer default 0,
  message_count integer default 0,
  updated_at timestamptz default now()
);

create table if not exists demand_by_location (
  location text primary key,
  search_count integer default 0,
  message_count integer default 0,
  updated_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table studs enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

create policy "Profiles viewable by all" on profiles for select using (true);
create policy "Users manage own profile" on profiles for all using (auth.uid() = id);

create policy "Active studs viewable by all" on studs for select using (status = 'active');
create policy "Owners manage own studs" on studs for all using (auth.uid() = owner_id);

create policy "Conversation participants can view" on conversations for select using (auth.uid() = buyer_id or auth.uid() = owner_id);
create policy "Buyers can create conversations" on conversations for insert with check (auth.uid() = buyer_id);
create policy "Participants can update" on conversations for update using (auth.uid() = buyer_id or auth.uid() = owner_id);

create policy "Participants can view messages" on messages for select using (
  auth.uid() in (select buyer_id from conversations where id = conversation_id union select owner_id from conversations where id = conversation_id)
);
create policy "Participants can send messages" on messages for insert with check (
  auth.uid() in (select buyer_id from conversations where id = conversation_id union select owner_id from conversations where id = conversation_id)
);
