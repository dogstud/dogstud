-- profiles
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  slug text not null unique,
  kennel_name text,
  bio text,
  city text,
  state text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- stud_listings
create table if not exists stud_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  slug text not null unique,
  dog_name text not null,
  breed text not null,
  age int,
  city text not null,
  state text not null,
  stud_fee numeric(10,2),
  contact_for_fee boolean default false,
  short_summary text not null,
  description text not null,
  primary_image_url text,
  color text,
  weight numeric(5,1),
  pedigree_text text,
  health_testing text,
  akc_registered boolean default false,
  availability_status text default 'available' check (availability_status in ('available','unavailable','limited')),
  status text default 'draft' check (status in ('draft','published','archived')),
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- stud_images
create table if not exists stud_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references stud_listings(id) on delete cascade,
  image_url text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- inquiries
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references stud_listings(id) on delete cascade,
  breeder_user_id uuid not null references auth.users(id),
  sender_name text not null,
  sender_email text not null,
  sender_phone text,
  message text not null,
  status text default 'new' check (status in ('new','read','replied')),
  ip_address text,
  user_agent text,
  honeypot text,
  created_at timestamptz default now()
);

-- indexes
create index if not exists idx_stud_listings_breed on stud_listings(breed);
create index if not exists idx_stud_listings_state on stud_listings(state);
create index if not exists idx_stud_listings_status on stud_listings(status);
create index if not exists idx_stud_listings_featured on stud_listings(featured);
create index if not exists idx_stud_listings_user_id on stud_listings(user_id);
create index if not exists idx_inquiries_breeder_user_id on inquiries(breeder_user_id);
create index if not exists idx_inquiries_listing_id on inquiries(listing_id);

-- RLS
alter table profiles enable row level security;
alter table stud_listings enable row level security;
alter table stud_images enable row level security;
alter table inquiries enable row level security;

-- profiles policies
create policy "profiles_public_read" on profiles for select using (true);
create policy "profiles_owner_insert" on profiles for insert with check (auth.uid() = user_id);
create policy "profiles_owner_update" on profiles for update using (auth.uid() = user_id);

-- stud_listings policies
create policy "listings_public_read" on stud_listings for select using (status = 'published');
create policy "listings_owner_all" on stud_listings for all using (auth.uid() = user_id);

-- stud_images policies
create policy "images_public_read" on stud_images for select using (true);
create policy "images_owner_insert" on stud_images for insert with check (
  auth.uid() = (select user_id from stud_listings where id = listing_id)
);
create policy "images_owner_delete" on stud_images for delete using (
  auth.uid() = (select user_id from stud_listings where id = listing_id)
);

-- inquiries policies
create policy "inquiries_owner_read" on inquiries for select using (auth.uid() = breeder_user_id);
-- insert handled via service role in route handler only

-- trigger: auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, display_name, slug)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    lower(regexp_replace(coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), '[^a-z0-9]+', '-', 'g'))
    || '-' || substr(new.id::text, 1, 8)
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
