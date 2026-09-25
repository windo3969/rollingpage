-- 0007: events 삭제 권한 (테스트 데이터 정리용)
-- 실행: Supabase 대시보드 → SQL Editor → New query → 전체 붙여넣기 → Run
--
-- 데모 방(seed:demo)에서 누른 클릭이 수요 통계(stats:pdf)에 섞이지 않도록 정리할 때 쓴다.
-- 앱 코드는 이벤트를 지우지 않는다. anon/authenticated는 여전히 접근 불가.

grant delete on public.events to service_role;

notify pgrst, 'reload schema';
