-- 0011: 포토북 신청을 "소책자 PDF 무료 제공"으로 전환
-- 실행: Supabase 대시보드 → SQL Editor → New query → 전체 붙여넣기 → Run
--
-- * room_id: 어느 롤링페이퍼로 PDF를 만들지 알기 위해 신청과 방을 연결한다 (방 삭제 시 null)
-- * followup_consented_at → marketing_consented_at:
--   선택 동의의 의미가 "실물 소책자 할인 소식(광고성 정보) 수신 동의"로 바뀌어 이름을 맞춘다.
--   후기 요청은 필수 동의 목적(PDF 전달, 수령 확인 및 후기 요청)에 포함된다.

alter table public.photobook_requests
  add column room_id text references public.rooms (id) on delete set null;

alter table public.photobook_requests
  rename column followup_consented_at to marketing_consented_at;

notify pgrst, 'reload schema';
