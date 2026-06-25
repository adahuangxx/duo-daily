-- Duo Daily · 在 Supabase Dashboard → SQL Editor 里整段运行
-- Project: mixeunweohqhdezhcyzy

-- 1. 表
create table if not exists public.day_entries (
  id uuid primary key default gen_random_uuid(),
  user_id text not null check (user_id in ('ada', 'ya')),
  date date not null,
  type text not null check (type in ('study', 'exercise', 'rest')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint day_entries_user_date_unique unique (user_id, date)
);

-- 2. API 访问权限（缺了会导致 REST 看不到表）
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.day_entries to anon, authenticated;

-- 3. RLS
alter table public.day_entries enable row level security;

drop policy if exists "anon_select_day_entries" on public.day_entries;
drop policy if exists "anon_insert_day_entries" on public.day_entries;
drop policy if exists "anon_update_day_entries" on public.day_entries;
drop policy if exists "anon_delete_day_entries" on public.day_entries;

create policy "anon_select_day_entries"
  on public.day_entries for select to anon, authenticated using (true);

create policy "anon_insert_day_entries"
  on public.day_entries for insert to anon, authenticated with check (true);

create policy "anon_update_day_entries"
  on public.day_entries for update to anon, authenticated using (true);

create policy "anon_delete_day_entries"
  on public.day_entries for delete to anon, authenticated using (true);

-- 4. 通知 PostgREST 刷新 schema 缓存（解决 PGRST205）
notify pgrst, 'reload schema';

-- 5. 可选：Realtime（失败可忽略，不影响打卡）
do $$
begin
  alter publication supabase_realtime add table public.day_entries;
exception
  when duplicate_object then null;
  when others then
    raise notice 'Realtime skipped: %', sqlerrm;
end $$;
