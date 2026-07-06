-- ============================================================
-- AI Meeting Notes — Supabase Schema
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- -------------------------------------------------------
-- 1. profiles
-- -------------------------------------------------------
create table if not exists public.profiles (
  id                     uuid primary key references auth.users(id) on delete cascade,
  plan                   text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  subscription_status    text,
  created_at             timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- -------------------------------------------------------
-- 2. meeting_notes
-- -------------------------------------------------------
create table if not exists public.meeting_notes (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  transcript_text text not null,
  summary         text not null,
  action_items    jsonb not null default '[]',
  created_at      timestamptz not null default now()
);

alter table public.meeting_notes enable row level security;

create policy "Users can view own notes"
  on public.meeting_notes for select
  using (auth.uid() = user_id);

create policy "Users can insert own notes"
  on public.meeting_notes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own notes"
  on public.meeting_notes for delete
  using (auth.uid() = user_id);

-- -------------------------------------------------------
-- 3. usage_counters
-- -------------------------------------------------------
create table if not exists public.usage_counters (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  usage_date date not null default current_date,
  count      integer not null default 0,
  primary key (user_id, usage_date)
);

alter table public.usage_counters enable row level security;

create policy "Users can view own usage"
  on public.usage_counters for select
  using (auth.uid() = user_id);

create policy "Users can insert own usage"
  on public.usage_counters for insert
  with check (auth.uid() = user_id);

create policy "Users can update own usage"
  on public.usage_counters for update
  using (auth.uid() = user_id);

-- -------------------------------------------------------
-- 4. Auto-create profile on signup
-- -------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -------------------------------------------------------
-- 5. Helper RPC for incrementing usage (avoids race conditions)
-- -------------------------------------------------------
create or replace function public.increment_usage(p_user_id uuid, p_date date)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.usage_counters (user_id, usage_date, count)
  values (p_user_id, p_date, 1)
  on conflict (user_id, usage_date)
  do update set count = usage_counters.count + 1;
end;
$$;
