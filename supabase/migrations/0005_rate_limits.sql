-- 0005: 요청 횟수 제한 (방 생성, 비밀번호 시도, 메시지 작성)
-- 실행: Supabase 대시보드 → SQL Editor → New query → 전체 붙여넣기 → Run
--
-- * key에는 IP 원문 대신 서버에서 만든 해시가 들어간다 (예: "create:<sha256>")
-- * 고정 윈도우 방식: 윈도우 시작 시각별로 카운트를 원자적으로 +1
-- * 이틀 지난 행은 호출 시 가끔(1%) 정리한다
-- * 함수는 service_role만 실행 가능 (기본 PUBLIC 실행 권한 제거)

create table public.rate_limits (
  key           text not null,
  window_start  timestamptz not null,
  count         integer not null default 1,
  primary key (key, window_start)
);

create index rate_limits_window_start_idx on public.rate_limits (window_start);

alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;

-- 허용이면 true, 제한 초과면 false
create or replace function public.check_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  v_count  integer;
begin
  insert into public.rate_limits (key, window_start)
  values (p_key, v_window)
  on conflict (key, window_start) do update set count = public.rate_limits.count + 1
  returning count into v_count;

  if random() < 0.01 then
    delete from public.rate_limits where window_start < now() - interval '2 days';
  end if;

  return v_count <= p_limit;
end;
$$;

revoke all on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;

notify pgrst, 'reload schema';
