import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

// service role 클라이언트: RLS를 우회하므로 서버 코드에서만, 꼭 필요한 곳에만 사용한다.
// "server-only" import 덕분에 클라이언트 번들에 포함되면 빌드가 실패한다.
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("환경 변수 SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.");
  }
  return createClient(supabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
