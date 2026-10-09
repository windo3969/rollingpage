-- 0009: 실물 포토북 신청 — 후속 연락 선택 동의
-- 실행: Supabase 대시보드 → SQL Editor → New query → 전체 붙여넣기 → Run
--
-- 필수 동의(제작 안내·배송지 확인)와 별도로, 샘플 수령 후 후기 요청 및
-- 추가 구매(유료) 안내 연락에 대한 선택 동의를 기록한다.
-- null = 동의하지 않음 → 이 사람에게는 후기·구매 안내 연락을 하지 않는다.

alter table public.photobook_requests
  add column followup_consented_at timestamptz;

notify pgrst, 'reload schema';
