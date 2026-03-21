-- Supabase SQL: score_history 테이블 생성
-- Supabase Dashboard → SQL Editor에서 실행

create table if not exists score_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  address text not null,
  total_score integer not null,
  wallet_age integer not null default 0,
  tx_volume integer not null default 0,
  defi_activity integer not null default 0,
  balance integer not null default 0,
  token_diversity integer not null default 0,
  tier_name text not null,
  percentile integer not null,
  analyzed_at timestamptz default now() not null,
  created_at timestamptz default now() not null
);

-- 인덱스
create index if not exists idx_score_history_user_address
  on score_history(user_id, address, analyzed_at desc);

-- RLS 정책
alter table score_history enable row level security;

create policy "Users can read own scores"
  on score_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own scores"
  on score_history for insert
  with check (auth.uid() = user_id);
