import "server-only";
import { createAdminClient } from "./supabase/admin";

// 실물 포토북 신청 수 (남은 자리 계산용). 개인정보는 읽지 않고 개수만 센다.
export async function countPhotobookRequests(): Promise<number> {
  const { count, error } = await createAdminClient()
    .from("photobook_requests")
    .select("id", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}
