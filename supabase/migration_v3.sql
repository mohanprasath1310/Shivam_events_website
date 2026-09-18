-- ============================================================
-- SHIVAM EVENTS — Migration v3
-- Run in Supabase SQL Editor AFTER schema.sql and migration_v2.sql.
-- Adds columns for the reworked Booking form (Needs/Add-ons
-- multi-select + general Special Requirements). Additive only —
-- does not touch existing data or drop any columns.
-- ============================================================

alter table bookings add column if not exists addons text[];
alter table bookings add column if not exists addon_other text;
alter table bookings add column if not exists special_requirements text;

-- Note: the earlier decoration_description / decoration_special_requirements /
-- decoration_images / paper_blast_quantity columns from migration_v2.sql are
-- left in place (harmless if unused) in case you still want that level of
-- per-service detail for a future version of the form.

-- ============================================================
-- Done.
-- ============================================================
