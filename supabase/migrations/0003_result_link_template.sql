-- 0003: 결과 링크 + 템플릿
-- 실행: Supabase 대시보드 → SQL Editor → 전체 붙여넣기 → Run
--
-- result_id: 받는 사람에게 보내는 결과 페이지(/v/<result_id>)용 별도 비밀 ID.
--   공유 링크(/r/<id>)와 분리해서, 작성자들이 서로의 메시지나 결과물을 미리 볼 수 없게 한다.
--   32자 hex(122bit 랜덤). 기존 방에도 행마다 서로 다른 값이 채워진다.
-- template: 결과 페이지 디자인 (paper = 크림 종이, pastel = 파스텔 하늘)

alter table public.rooms
  add column result_id text not null unique
    default replace(gen_random_uuid()::text, '-', '')
    check (result_id ~ '^[a-f0-9]{32}$'),
  add column template text not null default 'paper'
    check (template in ('paper', 'pastel'));

notify pgrst, 'reload schema';
