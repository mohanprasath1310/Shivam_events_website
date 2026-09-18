-- ============================================================
-- SHIVAM EVENTS — Migration v2
-- Run this in the Supabase SQL Editor AFTER schema.sql has
-- already been run once. Safe to run on an existing database —
-- it only ADDS columns/tables, it does not drop anything.
-- ============================================================

-- ------------------------------------------------------------
-- 1. New columns on services: booking-configuration values
--    (max charge, paper blast shot limits, decoration image limits)
-- ------------------------------------------------------------
alter table services add column if not exists max_charge numeric;
alter table services add column if not exists min_shots integer default 1;
alter table services add column if not exists max_shots integer default 50;
alter table services add column if not exists max_images integer default 5;
alter table services add column if not exists max_image_size_mb integer default 5;

-- ------------------------------------------------------------
-- 2. New columns on bookings: budget system + service-specific fields
-- ------------------------------------------------------------
alter table bookings add column if not exists expected_budget numeric;
alter table bookings add column if not exists paper_blast_quantity integer;
alter table bookings add column if not exists decoration_description text;
alter table bookings add column if not exists decoration_special_requirements text;
alter table bookings add column if not exists decoration_images text[];

-- ------------------------------------------------------------
-- 3. New table: contact_messages (Contact page submissions,
--    previously incorrectly stored in the bookings table)
-- ------------------------------------------------------------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text not null,
  status text default 'New' check (status in ('New', 'Read', 'Responded')),
  created_at timestamptz default now()
);

alter table contact_messages enable row level security;

create policy "Public can submit contact messages" on contact_messages
  for insert to anon, authenticated with check (true);
create policy "Admins can read contact messages" on contact_messages
  for select to authenticated using (true);
create policy "Admins can update contact messages" on contact_messages
  for update to authenticated using (true);
create policy "Admins can delete contact messages" on contact_messages
  for delete to authenticated using (true);

create index if not exists idx_contact_messages_status on contact_messages(status);
create index if not exists idx_contact_messages_created on contact_messages(created_at desc);

-- ------------------------------------------------------------
-- 4. New storage bucket: decoration-inspirations
--    Customers upload these BEFORE they're logged in (they never
--    log in at all), so — unlike every other bucket — anonymous
--    visitors need INSERT rights here. Public read stays on so
--    admins/staff can view them via plain URLs.
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('decoration-inspirations', 'decoration-inspirations', true)
on conflict (id) do nothing;

create policy "Public read decoration inspirations" on storage.objects
  for select using (bucket_id = 'decoration-inspirations');
create policy "Anyone can upload decoration inspirations" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'decoration-inspirations');
create policy "Admins delete decoration inspirations" on storage.objects
  for delete to authenticated using (bucket_id = 'decoration-inspirations');

-- ------------------------------------------------------------
-- 5. Restructure seeded services to the 3 primary offerings:
--    DJ Events, Paper Blast, Decoration. Older starter services
--    (Birthday, Wedding) are deactivated rather than deleted, in
--    case you already have bookings/gallery items referencing them.
-- ------------------------------------------------------------
update services set is_active = false where slug in ('birthday-events', 'wedding-events');

update services
set max_charge = 25000, min_shots = 1, max_shots = 50
where slug = 'dj-events';

update services
set max_charge = 15000, min_shots = 1, max_shots = 100
where slug = 'paper-blast';

-- Rename the old "Stage Decoration" starter service to "Decoration"
-- per the new spec, and set its booking-config defaults.
update services
set name = 'Decoration',
    slug = 'decoration',
    short_description = 'Elegant decoration for any occasion',
    description = 'Custom decoration tailored to your event theme — tell us your vision and we''ll bring it to life.',
    max_charge = 30000,
    max_images = 5,
    max_image_size_mb = 5
where slug = 'stage-decoration';

-- If for some reason no decoration-type service exists yet, add one.
insert into services (name, slug, short_description, description, price, max_charge, max_images, max_image_size_mb, display_order, is_featured, is_active)
select 'Decoration', 'decoration', 'Elegant decoration for any occasion',
       'Custom decoration tailored to your event theme — tell us your vision and we''ll bring it to life.',
       8000, 30000, 5, 5, 3, true, true
where not exists (select 1 from services where slug = 'decoration');

-- ============================================================
-- Done. Next step: deploy the send-notification Edge Function
-- (see supabase/functions/send-notification/) for email alerts,
-- or skip it — bookings/messages still save to the database
-- and show up in the Admin Panel either way.
-- ============================================================
