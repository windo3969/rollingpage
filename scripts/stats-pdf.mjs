// 포토북 PDF 수요 확인: npm run stats:pdf
// Phase 3(수익화) 진행 전 이 숫자로 수요를 재확인한다 (CLAUDE.md 6장).
import { createClient } from "@supabase/supabase-js";

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const [{ data: events, error }, { count: roomCount }] = await Promise.all([
  admin.from("events").select("source, room_id, created_at").eq("name", "pdf_interest"),
  admin.from("rooms").select("id", { count: "exact", head: true }).not("id", "like", "DEMO%"),
]);
if (error) {
  console.error("조회 실패:", error.message);
  process.exit(1);
}

const real = events.filter((e) => !e.room_id?.startsWith("DEMO"));
const rooms = new Set(real.map((e) => e.room_id).filter(Boolean));
const bySource = (s) => real.filter((e) => e.source === s).length;
const pct = roomCount ? ((rooms.size / roomCount) * 100).toFixed(1) : "0.0";

console.log("포토북 PDF 버튼 클릭 (데모 방 제외)");
console.log(`  총 클릭          ${real.length}회  (결과 페이지 ${bySource("result")} · 주최자 페이지 ${bySource("host")})`);
console.log(`  클릭이 있는 방   ${rooms.size}개 / 전체 방 ${roomCount ?? 0}개  (${pct}%)`);
