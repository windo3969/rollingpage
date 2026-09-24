-- 0004: 수요 검증용 이벤트 기록 (포토북 PDF 버튼 클릭)
-- 실행: Supabase 대시보드 → SQL Editor → New query → 전체 붙여넣기 → Run
--
-- 외부 분석 도구(GA 등)는 페이지 URL(방 ID, 결과 ID, 주최자 토큰 포함)을 외부로 보내므로 쓰지 않고,
-- 필요한 최소 정보만 자체 DB에 남긴다. IP·기기 정보·URL은 저장하지 않는다.

create table public.events (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (name in ('pdf_interest')),
  source      text not null check (source in ('result', 'host')),  -- 결과 페이지(받는 사람) / 주최자 페이지
  room_id     text references public.rooms (id) on delete set null, -- 방이 지워져도 수요 기록은 남긴다
  created_at  timestamptz not null default now()
);

create index events_name_created_at_idx on public.events (name, created_at);

alter table public.events enable row level security;

revoke all on public.events from anon, authenticated;
grant select, insert on public.events to service_role;

notify pgrst, 'reload schema';
