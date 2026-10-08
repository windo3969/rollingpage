-- 0008: 실물 포토북(소책자) 무료 제작 신청 (선착순 이벤트, 구매 전환 측정용)
-- 실행: Supabase 대시보드 → SQL Editor → New query → 전체 붙여넣기 → Run
--
-- * 개인정보: 이름(닉네임), 휴대폰 번호만 저장. 주소는 받지 않는다 (연락할 때 따로 받음)
-- * 보관: 이벤트 종료 시까지. 종료 후 npm run photobook:requests -- --purge 로 전부 삭제
-- * anon/authenticated는 접근 불가. 서버(service_role)만 저장·조회·삭제
-- * 같은 번호는 한 번만 신청 가능 (unique)

create table public.photobook_requests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 30),
  phone       text not null unique check (phone ~ '^01[016789][0-9]{7,8}$'),  -- 숫자만 저장 (예: 01012345678)
  source      text not null check (source in ('result', 'host', 'direct')),  -- 어디서 미리보기를 열고 신청했는지
  consented_at timestamptz not null,                                          -- 개인정보 수집·이용 동의 시각
  created_at  timestamptz not null default now()
);

alter table public.photobook_requests enable row level security;

revoke all on public.photobook_requests from anon, authenticated;
grant select, insert, delete on public.photobook_requests to service_role;

notify pgrst, 'reload schema';
