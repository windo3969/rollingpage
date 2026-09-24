// RLS/권한 확인: npm run check:rls
// anon 키로는 테이블 접근이 거부되고, service role로는 접근되는지 확인한다.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

let ok = true;
for (const table of ["rooms", "messages", "events", "rate_limits"]) {
  const a = await anon.from(table).select("*").limit(1);
  const anonBlocked = a.error?.code === "42501"; // permission denied
  console.log(`${anonBlocked ? "✓" : "✗"} anon → ${table}: ${anonBlocked ? `거부됨 (${a.error.message})` : a.error ? a.error.message : "접근 가능! 권한 설정 확인 필요"}`);

  const s = await admin.from(table).select("*").limit(1);
  console.log(`${s.error ? "✗" : "✓"} service role → ${table}: ${s.error ? s.error.message : "접근 가능"}`);

  ok &&= anonBlocked && !s.error;
}

const report = (pass, msg) => {
  console.log(`${pass ? "✓" : "✗"} ${msg}`);
  ok &&= pass;
};

// ─── 요청 횟수 제한 함수 ─────────────────────────────
{
  const args = { p_key: `_check-rls:${Date.now()}`, p_limit: 3, p_window_seconds: 60 };
  const anonCall = await anon.rpc("check_rate_limit", args);
  report(
    anonCall.error?.code === "42501", // permission denied
    `anon → check_rate_limit 실행: ${anonCall.error ? anonCall.error.message : "실행 가능! 권한 설정 확인 필요"}`,
  );

  const results = [];
  for (let i = 0; i < 4; i++) results.push((await admin.rpc("check_rate_limit", args)).data);
  report(
    JSON.stringify(results) === "[true,true,true,false]",
    `service role → 제한 3회: 4번째 차단 (${JSON.stringify(results)})`,
  );
  await admin.from("rate_limits").delete().like("key", "_check-rls:%");
}

// ─── Storage: photos 버킷 ───────────────────────────

const bucket = await admin.storage.getBucket("photos");
report(!bucket.error, `photos 버킷 존재: ${bucket.error ? bucket.error.message : "있음"}`);
if (!bucket.error) {
  report(bucket.data.public === false, `photos 버킷 비공개: public = ${bucket.data.public}`);

  // 테스트 파일을 service role로 올려두고 anon으로 접근해본다
  const path = `_check-rls/${Date.now()}.jpg`;
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10]);
  const up = await admin.storage.from("photos").upload(path, jpeg, { contentType: "image/jpeg" });
  report(!up.error, `service role → 업로드: ${up.error ? up.error.message : "가능"}`);

  const anonList = await anon.storage.from("photos").list("_check-rls");
  report(anonList.error || anonList.data.length === 0, "anon → 목록 조회: 거부됨");

  const anonDownload = await anon.storage.from("photos").download(path);
  report(Boolean(anonDownload.error), "anon → 다운로드: 거부됨");

  const publicRes = await fetch(anon.storage.from("photos").getPublicUrl(path).data.publicUrl);
  report(!publicRes.ok, `공개 URL 접근: 거부됨 (HTTP ${publicRes.status})`);

  const anonUpload = await anon.storage.from("photos").upload(`_check-rls/anon-${Date.now()}.jpg`, jpeg, { contentType: "image/jpeg" });
  report(Boolean(anonUpload.error), "anon → 업로드: 거부됨");

  await admin.storage.from("photos").remove([path]);
}

process.exit(ok ? 0 : 1);
