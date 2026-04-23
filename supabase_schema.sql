-- Run this in your Supabase SQL Editor

-- Profiles table (shared between both roles)
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  role text check (role in ('influencer', 'business')) not null,
  full_name text not null,
  avatar_url text,
  bio text,
  tagline text,
  location text,
  created_at timestamptz default now() not null
);

-- Influencer profiles
create table public.influencer_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  niche text[] default '{}',
  platforms text[] default '{}',
  engagement_rate numeric(5,2) default 0,
  gallery_images text[] default '{}'
);

-- Per-platform data for influencers (URL + follower count per platform)
create table public.influencer_platforms (
  id uuid primary key default gen_random_uuid(),
  influencer_id uuid not null references public.influencer_profiles(id) on delete cascade,
  platform_name text not null,
  profile_url text,
  followers_count integer default 0,
  created_at timestamptz default now() not null
);

-- Services offered by influencers (fixed-price menu)
create table public.services (
  id uuid primary key default gen_random_uuid(),
  influencer_id uuid not null references public.influencer_profiles(id) on delete cascade,
  platform text not null,
  service_type text not null,
  price numeric(10,2) not null,
  currency text not null default 'USD',
  created_at timestamptz default now() not null
);

-- Business profiles
create table public.business_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  company_name text not null,
  industry text not null,
  website text,
  company_size text check (company_size in ('1-10', '11-50', '51-200', '200+'))
);

-- Row level security
alter table public.profiles enable row level security;
alter table public.influencer_profiles enable row level security;
alter table public.business_profiles enable row level security;
alter table public.influencer_platforms enable row level security;
alter table public.services enable row level security;

-- Policies: users can read all profiles, only edit their own
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = user_id);

create policy "Influencer profiles are viewable by everyone" on public.influencer_profiles for select using (true);
create policy "Users can insert their own influencer profile" on public.influencer_profiles for insert with check (
  exists (select 1 from public.profiles where id = influencer_profiles.id and user_id = auth.uid())
);
create policy "Users can update their own influencer profile" on public.influencer_profiles for update using (
  exists (select 1 from public.profiles where id = influencer_profiles.id and user_id = auth.uid())
);

create policy "Business profiles are viewable by everyone" on public.business_profiles for select using (true);
create policy "Users can insert their own business profile" on public.business_profiles for insert with check (
  exists (select 1 from public.profiles where id = business_profiles.id and user_id = auth.uid())
);
create policy "Users can update their own business profile" on public.business_profiles for update using (
  exists (select 1 from public.profiles where id = business_profiles.id and user_id = auth.uid())
);

create policy "Influencer platforms are viewable by everyone" on public.influencer_platforms for select using (true);
create policy "Users can insert their own platforms" on public.influencer_platforms for insert with check (
  exists (select 1 from public.profiles p where p.id = influencer_platforms.influencer_id and p.user_id = auth.uid())
);
create policy "Users can update their own platforms" on public.influencer_platforms for update using (
  exists (select 1 from public.profiles p where p.id = influencer_platforms.influencer_id and p.user_id = auth.uid())
);
create policy "Users can delete their own platforms" on public.influencer_platforms for delete using (
  exists (select 1 from public.profiles p where p.id = influencer_platforms.influencer_id and p.user_id = auth.uid())
);

create policy "Services are viewable by everyone" on public.services for select using (true);
create policy "Users can insert their own services" on public.services for insert with check (
  exists (select 1 from public.profiles p where p.id = services.influencer_id and p.user_id = auth.uid())
);
create policy "Users can update their own services" on public.services for update using (
  exists (select 1 from public.profiles p where p.id = services.influencer_id and p.user_id = auth.uid())
);
create policy "Users can delete their own services" on public.services for delete using (
  exists (select 1 from public.profiles p where p.id = services.influencer_id and p.user_id = auth.uid())
);

-- ─────────────────────────────────────────────────────────────────
-- MIGRATIONS (run these if you already have existing tables)
-- ─────────────────────────────────────────────────────────────────
-- ALTER TABLE public.profiles ADD COLUMN tagline text;
-- ALTER TABLE public.influencer_profiles
--   DROP COLUMN IF EXISTS instagram_handle,
--   DROP COLUMN IF EXISTS tiktok_handle,
--   DROP COLUMN IF EXISTS youtube_handle,
--   DROP COLUMN IF EXISTS followers_count,
--   ADD COLUMN gallery_images text[] DEFAULT '{}';
-- (then create influencer_platforms and services tables above)
