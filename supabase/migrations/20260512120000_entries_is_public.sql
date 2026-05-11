-- Chronicle: public vs private daily entries (private = journal only, excluded from followers' feed).
-- Apply in Supabase Dashboard → SQL → Run once.
-- Existing rows default to public so behavior matches before this change.

alter table public.entries
  add column if not exists is_public boolean not null default true;

comment on column public.entries.is_public is 'When false, entry is visible only to the author (not on followers feed).';
