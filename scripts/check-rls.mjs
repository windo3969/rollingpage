// RLS/권한 확인: npm run check:rls
// anon 키로는 테이블 접근이 거부되고, service role로는 접근되는지 확인한다.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

let ok = true;
for (const table of ["rooms", "messages"]) {
  const a = await anon.from(table).select("*").limit(1);
  const anonBlocked = a.error?.code === "42501"; // permission denied
  console.log(`${anonBlocked ? "✓" : "✗"} anon → ${table}: ${anonBlocked ? `거부됨 (${a.error.message})` : a.error ? a.error.message : "접근 가능! 권한 설정 확인 필요"}`);

  const s = await admin.from(table).select("*").limit(1);
  console.log(`${s.error ? "✗" : "✓"} service role → ${table}: ${s.error ? s.error.message : "접근 가능"}`);

  ok &&= anonBlocked && !s.error;
}
process.exit(ok ? 0 : 1);
