-- 0010: 익명 피드백 (개발자에게 의견 보내기)
-- 실행: Supabase 대시보드 → SQL Editor → New query → 전체 붙여넣기 → Run
--
-- * 익명: 이름·연락처·IP·방 주소(방 ID, 결과 ID, 주최자 토큰)는 저장하지 않는다. 화면 종류만 남긴다
-- * 평가와 자유 의견 중 하나 이상은 있어야 한다
-- * anon/authenticated는 접근 불가. 서버(service_role)만 저장·조회·삭제

create table public.feedback (
  id          uuid primary key default gen_random_uuid(),
  page        text not null check (page in ('write', 'result', 'host')),  -- 작성 완료 / 결과 / 주최자
  rating      text check (rating in ('good', 'okay', 'bad')),
  message     text check (char_length(message) between 1 and 1000),
  created_at  timestamptz not null default now(),
  check (rating is not null or message is not null)
);

create index feedback_created_at_idx on public.feedback (created_at desc);

alter table public.feedback enable row level security;

revoke all on public.feedback from anon, authenticated;
grant select, insert, delete on public.feedback to service_role;

notify pgrst, 'reload schema';
