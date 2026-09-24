import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./env";

// 브라우저/서버 공용 anon 클라이언트. 권한은 RLS 정책으로만 결정된다.
export function createAnonClient() {
  return createClient(supabaseUrl(), supabaseAnonKey(), {
    auth: { persistSession: false },
  });
}
