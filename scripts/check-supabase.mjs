// Supabase 연결 확인: npm run check:supabase
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error("✗ .env.local에 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY를 채워주세요.");
  process.exit(1);
}

async function check(label, key) {
  const res = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
  console.log(`${res.ok ? "✓" : "✗"} ${label}: HTTP ${res.status}`);
  return res.ok;
}

const ok = (await check("anon key", anonKey)) & (await check("service role key", serviceKey));
process.exit(ok ? 0 : 1);
