import "server-only";
import { createAdminClient } from "./supabase/admin";

// 비공개 버킷 사진은 유효기간 있는 signed URL로만 보여준다 (CLAUDE.md 보안 원칙 3).
// 페이지를 열 때마다 새로 발급되므로, 링크가 새어 나가도 1시간 뒤에는 쓸 수 없다.
const SIGNED_URL_TTL_SECONDS = 60 * 60;

export async function signPhotoUrls(paths: string[]): Promise<Map<string, string>> {
  const urls = new Map<string, string>();
  if (paths.length === 0) return urls;

  const { data, error } = await createAdminClient()
    .storage.from("photos")
    .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
  if (error) throw error;

  for (const item of data) {
    if (item.path && item.signedUrl) urls.set(item.path, item.signedUrl);
  }
  return urls;
}
