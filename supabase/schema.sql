-- ============================================================
-- SHIVAM EVENTS — Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- (Project → SQL Editor → New Query → paste → Run)
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- Single-row table holding all site-wide settings / home content
create table if not exists website_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text default 'Shivam Events',
  logo_url text,
  hero_subtitle text default 'NO.1 EVENT MANAGEMENT',
  hero_title text default 'SHIVAM EVENTS',
  hero_description text default 'DJ EVENTS | PAPER BLAST | STAGE DECORATION\nAND MORE FOR ALL YOUR SPECIAL MOMENTS',
  hero_image text,
  hero_video text,
  phone_1 text default '7603877178',
  phone_2 text default '6384233642',
  whatsapp text default '917603877178',
  email text,
  address text default 'Moodimangalam, Karur',
  instagram text default 'no.1_shivam_events',
  youtube text,
  facebook text,
  google_maps_url text,
  working_hours text default 'Mon - Sun: 9:00 AM - 10:00 PM',
  happy_events integer default 500,
  happy_clients integer default 100,
  years_experience integer default 5,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  cover_image text,
  price numeric,
  offer_price numeric,
  features text[] default '{}',
  display_order integer default 0,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Additional gallery images per service (used on ServiceDetail page)
create table if not exists service_images (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references services(id) on delete cascade,
  image_url text not null,
  display_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  category text,
  media_type text default 'image' check (media_type in ('image', 'video')),
  media_url text,
  thumbnail_url text,
  display_order integer default 0,
  is_featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  video_type text default 'youtube' check (video_type in ('youtube', 'instagram', 'uploaded')),
  video_url text not null,
  thumbnail_url text,
  display_order integer default 0,
  is_featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text,
  event_type text not null,
  event_date date,
  event_time time,
  location text,
  budget text,
  message text,
  status text default 'New' check (status in ('New', 'Pending', 'Confirmed', 'Completed', 'Cancelled')),
  created_at timestamptz default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  message text not null,
  rating integer default 5 check (rating between 1 and 5),
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_services_active on services(is_active);
create index if not exists idx_services_slug on services(slug);
create index if not exists idx_gallery_category on gallery(category);
create index if not exists idx_videos_category on videos(category);
create index if not exists idx_bookings_status on bookings(status);
create index if not exists idx_bookings_created on bookings(created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public (anon) can READ published content and INSERT bookings.
-- Only authenticated admins can INSERT/UPDATE/DELETE content.
-- ============================================================

alter table website_settings enable row level security;
alter table services enable row level security;
alter table service_images enable row level security;
alter table gallery enable row level security;
alter table videos enable row level security;
alter table bookings enable row level security;
alter table testimonials enable row level security;

-- website_settings: public read, admin write
create policy "Public can read settings" on website_settings for select using (true);
create policy "Admins can insert settings" on website_settings for insert to authenticated with check (true);
create policy "Admins can update settings" on website_settings for update to authenticated using (true);

-- services: public reads active rows, admin manages all
create policy "Public can read active services" on services for select using (is_active = true);
create policy "Admins can read all services" on services for select to authenticated using (true);
create policy "Admins can insert services" on services for insert to authenticated with check (true);
create policy "Admins can update services" on services for update to authenticated using (true);
create policy "Admins can delete services" on services for delete to authenticated using (true);

-- service_images: public read, admin write
create policy "Public can read service images" on service_images for select using (true);
create policy "Admins can insert service images" on service_images for insert to authenticated with check (true);
create policy "Admins can update service images" on service_images for update to authenticated using (true);
create policy "Admins can delete service images" on service_images for delete to authenticated using (true);

-- gallery: public read, admin write
create policy "Public can read gallery" on gallery for select using (true);
create policy "Admins can insert gallery" on gallery for insert to authenticated with check (true);
create policy "Admins can update gallery" on gallery for update to authenticated using (true);
create policy "Admins can delete gallery" on gallery for delete to authenticated using (true);

-- videos: public read, admin write
create policy "Public can read videos" on videos for select using (true);
create policy "Admins can insert videos" on videos for insert to authenticated with check (true);
create policy "Admins can update videos" on videos for update to authenticated using (true);
create policy "Admins can delete videos" on videos for delete to authenticated using (true);

-- bookings: public can INSERT only (submit enquiries), admin can read/update/delete
create policy "Public can submit bookings" on bookings for insert to anon, authenticated with check (true);
create policy "Admins can read bookings" on bookings for select to authenticated using (true);
create policy "Admins can update bookings" on bookings for update to authenticated using (true);
create policy "Admins can delete bookings" on bookings for delete to authenticated using (true);

-- testimonials: public reads active, admin manages all
create policy "Public can read active testimonials" on testimonials for select using (is_active = true);
create policy "Admins can read all testimonials" on testimonials for select to authenticated using (true);
create policy "Admins can insert testimonials" on testimonials for insert to authenticated with check (true);
create policy "Admins can update testimonials" on testimonials for update to authenticated using (true);
create policy "Admins can delete testimonials" on testimonials for delete to authenticated using (true);

-- ============================================================
-- STORAGE BUCKETS
-- Public read, authenticated write, for each media category
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('services', 'services', true),
  ('gallery', 'gallery', true),
  ('videos', 'videos', true),
  ('testimonials', 'testimonials', true),
  ('settings', 'settings', true)
on conflict (id) do nothing;

-- Storage policies: public read, authenticated write/delete, applied per bucket
create policy "Public read services bucket" on storage.objects for select using (bucket_id = 'services');
create policy "Admins write services bucket" on storage.objects for insert to authenticated with check (bucket_id = 'services');
create policy "Admins update services bucket" on storage.objects for update to authenticated using (bucket_id = 'services');
create policy "Admins delete services bucket" on storage.objects for delete to authenticated using (bucket_id = 'services');

create policy "Public read gallery bucket" on storage.objects for select using (bucket_id = 'gallery');
create policy "Admins write gallery bucket" on storage.objects for insert to authenticated with check (bucket_id = 'gallery');
create policy "Admins update gallery bucket" on storage.objects for update to authenticated using (bucket_id = 'gallery');
create policy "Admins delete gallery bucket" on storage.objects for delete to authenticated using (bucket_id = 'gallery');

create policy "Public read videos bucket" on storage.objects for select using (bucket_id = 'videos');
create policy "Admins write videos bucket" on storage.objects for insert to authenticated with check (bucket_id = 'videos');
create policy "Admins update videos bucket" on storage.objects for update to authenticated using (bucket_id = 'videos');
create policy "Admins delete videos bucket" on storage.objects for delete to authenticated using (bucket_id = 'videos');

create policy "Public read testimonials bucket" on storage.objects for select using (bucket_id = 'testimonials');
create policy "Admins write testimonials bucket" on storage.objects for insert to authenticated with check (bucket_id = 'testimonials');
create policy "Admins update testimonials bucket" on storage.objects for update to authenticated using (bucket_id = 'testimonials');
create policy "Admins delete testimonials bucket" on storage.objects for delete to authenticated using (bucket_id = 'testimonials');

create policy "Public read settings bucket" on storage.objects for select using (bucket_id = 'settings');
create policy "Admins write settings bucket" on storage.objects for insert to authenticated with check (bucket_id = 'settings');
create policy "Admins update settings bucket" on storage.objects for update to authenticated using (bucket_id = 'settings');
create policy "Admins delete settings bucket" on storage.objects for delete to authenticated using (bucket_id = 'settings');

-- ============================================================
-- SEED DATA (safe to run once — creates the default settings row
-- and a handful of starter services so the site isn't empty)
-- ============================================================

insert into website_settings (business_name)
select 'Shivam Events'
where not exists (select 1 from website_settings);

insert into services (name, slug, short_description, description, price, display_order, is_featured, is_active)
values
  ('DJ Events', 'dj-events', 'High-energy DJ setups for any celebration', 'Professional DJ setup with premium sound and lighting for weddings, birthdays, and parties.', 5000, 1, true, true),
  ('Paper Blast', 'paper-blast', 'Colorful paper blast effects to light up your event', 'Confetti and paper blast effects that add excitement to entrances, cake cuttings, and celebrations.', 2000, 2, true, true),
  ('Birthday Events', 'birthday-events', 'Complete birthday celebration packages', 'Balloon decor, cake table styling, themed backdrops, and more for a memorable birthday.', 6000, 3, true, true),
  ('Wedding Events', 'wedding-events', 'Full wedding event management', 'End-to-end wedding planning including stage decoration, catering coordination, and entertainment.', 25000, 4, true, true),
  ('Stage Decoration', 'stage-decoration', 'Elegant stage setups for any occasion', 'Custom stage decoration with flowers, lighting, and backdrops tailored to your event theme.', 8000, 5, false, true)
on conflict (slug) do nothing;

-- ============================================================
-- Done. Next steps:
-- 1. Go to Authentication → Users → Add User to create your admin login.
-- 2. Copy your Project URL + anon key into .env (see .env.example).
-- ============================================================
