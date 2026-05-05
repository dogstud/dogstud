-- Phase 2 Migration: add slug, published_at, primary_image to pending_stud_submissions

alter table pending_stud_submissions
  add column if not exists slug text unique,
  add column if not exists published_at timestamptz,
  add column if not exists primary_image text;

create index if not exists idx_pending_submissions_slug on pending_stud_submissions(slug);
create index if not exists idx_pending_submissions_city on pending_stud_submissions(city);
create index if not exists idx_pending_submissions_state on pending_stud_submissions(state);
create index if not exists idx_pending_submissions_featured on pending_stud_submissions(featured);
create index if not exists idx_pending_submissions_verified on pending_stud_submissions(verified);

-- Backfill primary_image from first photo in photos array (for any existing approved rows)
update pending_stud_submissions
set primary_image = photos[1]
where primary_image is null and array_length(photos, 1) > 0;
