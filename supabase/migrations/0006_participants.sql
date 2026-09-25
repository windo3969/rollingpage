-- 0006: 참여자 명단 (Phase 2)
-- 실행: Supabase 대시보드 → SQL Editor → New query → 전체 붙여넣기 → Run
--
-- * 주최자가 이름 명단을 입력 → 작성자는 공용 링크에서 자기 이름을 골라 작성 (개인별 링크 없음)
-- * 작성 여부는 컬럼으로 저장하지 않고 messages.participant_id로 계산한다
-- * 명단에서 이름을 지워도 이미 쓴 메시지는 남는다 (participant_id만 null)

create table public.participants (
  id          uuid primary key default gen_random_uuid(),
  room_id     text not null references public.rooms (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 30),
  created_at  timestamptz not null default now(),
  unique (room_id, name)
);

alter table public.messages
  add column participant_id uuid references public.participants (id) on delete set null;

create index messages_participant_id_idx on public.messages (participant_id);

alter table public.participants enable row level security;

revoke all on public.participants from anon, authenticated;
grant select, insert, update, delete on public.participants to service_role;

notify pgrst, 'reload schema';
