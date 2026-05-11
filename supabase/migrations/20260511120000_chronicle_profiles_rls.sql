-- Chronicle: profiles RLS so authenticated users can read profiles and
-- insert/update only their own row (required for sign-up + Profile upsert).
-- Apply: Supabase Dashboard → SQL → New query → paste → Run.
-- If "policy already exists" appears, drop the conflicting policy in
-- Authentication → Policies, or rename/drop the chronicle_* policies below and re-run.

alter table public.profiles enable row level security;

drop policy if exists "chronicle_profiles_select" on public.profiles;
drop policy if exists "chronicle_profiles_insert_own" on public.profiles;
drop policy if exists "chronicle_profiles_update_own" on public.profiles;

create policy "chronicle_profiles_select"
  on public.profiles
  for select
  to authenticated
  using (true);

create policy "chronicle_profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "chronicle_profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
