// 익명 피드백 보기: npm run feedback          (최근 50개)
//                   npm run feedback -- 200   (최근 200개)
import { createClient } from "@supabase/supabase-js";

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const limit = Number(process.argv[2]) || 50;

const { data, error } = await admin
  .from("feedback")
  .select("page, rating, message, created_at")
  .order("created_at", { ascending: false })
  .limit(limit);
if (error) throw error;

const PAGE = { write: "작성 완료", result: "결과", host: "주최자" };
const RATING = { good: "좋았어요", okay: "보통", bad: "아쉬워요" };
const when = (s) => new Date(s).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });

console.log(`익명 피드백 최근 ${data.length}개 (새 것부터)\n`);
for (const f of data) {
  console.log(`[${when(f.created_at)}] ${PAGE[f.page]} 화면 · ${f.rating ? RATING[f.rating] : "평가 없음"}`);
  if (f.message) console.log(`  ${f.message.replace(/\n/g, "\n  ")}`);
  console.log("");
}
