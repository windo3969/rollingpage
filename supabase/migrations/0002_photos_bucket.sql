-- 0002: 사진 저장용 비공개 버킷
-- 실행: Supabase 대시보드 → SQL Editor → 전체 붙여넣기 → Run
--
-- * public = false: 공개 URL로 접근 불가. 조회는 서버가 발급한 유효기간 있는 signed URL로만 (6단계)
-- * storage.objects에 anon/authenticated용 정책을 만들지 않는다 → 브라우저 키로는 업로드·조회·목록 모두 불가
--   업로드는 Next.js 서버가 service_role로 수행한다.
-- * 파일 크기·형식 제한을 버킷 레벨에서도 건다 (서버 검증과 이중 방어)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', false, 2 * 1024 * 1024, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
