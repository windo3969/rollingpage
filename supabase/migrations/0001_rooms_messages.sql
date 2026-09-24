-- 0001: rooms / messages 테이블 + RLS
-- 실행: Supabase 대시보드 → SQL Editor → 전체 붙여넣기 → Run
--
-- 권한 설계
--   * anon / authenticated(브라우저에 노출되는 키)는 테이블에 직접 접근할 수 없다.
--     rooms에 SELECT를 허용하면 전체 방 목록(ID, 이름)이 새어 나가 "추측 불가능한 URL"이 무의미해진다.
--   * 모든 읽기/쓰기는 Next.js 서버에서 service_role로 수행하며,
--     방 ID 확인·비밀번호 검증·host 토큰 검증은 서버 코드가 담당한다.
--   * RLS는 켜 두되 anon용 정책을 만들지 않는다 → anon 요청은 DB 레벨에서 전부 거부된다.

-- ─────────────────────────────────────────────
-- rooms
-- ─────────────────────────────────────────────
create table public.rooms (
  id               text primary key
                   check (id ~ '^[A-Za-z0-9_-]{16,}$'),          -- nanoid, 16자 이상
  title            text not null check (char_length(title) between 1 and 100),
  recipient_name   text not null check (char_length(recipient_name) between 1 and 50),
  deadline         timestamptz not null,
  password_hash    text,                                          -- null = 비밀번호 없음. 평문 저장 금지
  host_token_hash  text not null unique,                          -- 주최자 토큰의 해시. 원본 토큰은 주최자 링크에만 존재
  created_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- messages
-- (participant_id 컬럼은 Phase 2에서 participants 테이블과 함께 추가)
-- ─────────────────────────────────────────────
create table public.messages (
  id           uuid primary key default gen_random_uuid(),
  room_id      text not null references public.rooms (id) on delete cascade,
  author_name  text not null check (char_length(author_name) between 1 and 30),
  content      text not null check (char_length(content) between 1 and 2000),
  photo_path   text,                                              -- 비공개 버킷 내 경로
  created_at   timestamptz not null default now()
);

create index messages_room_id_created_at_idx
  on public.messages (room_id, created_at);

-- ─────────────────────────────────────────────
-- RLS: 켜고, anon/authenticated 정책은 만들지 않는다
-- ─────────────────────────────────────────────
alter table public.rooms    enable row level security;
alter table public.messages enable row level security;

-- ─────────────────────────────────────────────
-- 권한: "Automatically expose new tables"를 껐으므로 명시적으로 부여
-- ─────────────────────────────────────────────
revoke all on public.rooms, public.messages from anon, authenticated;
grant select, insert, update, delete on public.rooms, public.messages to service_role;

-- Data API 스키마 캐시 갱신
notify pgrst, 'reload schema';