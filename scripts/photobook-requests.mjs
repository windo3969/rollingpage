// 실물 포토북 신청자 확인 (연락용):        npm run photobook:requests
// 이벤트 종료 후 신청자 정보 전부 파기:     npm run photobook:requests -- --purge
//
// 개인정보(이름, 휴대폰 번호)가 출력되므로 화면 공유·캡처에 주의한다.
// 보유 기간은 "이벤트 종료 시까지"로 안내했으므로, 이벤트가 끝나면 반드시 --purge 로 지운다.
import { createClient } from "@supabase/supabase-js";

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

if (process.argv.includes("--purge")) {
  const { count, error } = await admin.from("photobook_requests").delete({ count: "exact" }).not("id", "is", null);
  if (error) throw error;
  console.log(`신청자 정보 ${count}건을 파기했습니다.`);
  process.exit(0);
}

const { data, error } = await admin
  .from("photobook_requests")
  .select("name, phone, source, created_at, followup_consented_at")
  .order("created_at", { ascending: true });
if (error) throw error;

const SOURCE = { result: "결과 페이지", host: "주최자 페이지", direct: "직접 방문" };
const phone = (p) => p.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
const when = (s) => new Date(s).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

const followups = data.filter((r) => r.followup_consented_at).length;
console.log(`실물 포토북 신청 ${data.length}명 (후기·추가 구매 연락 동의 ${followups}명)\n`);
// "배송 연락만"인 사람에게는 제작·배송 연락만 한다 (후기 요청, 유료 구매 안내 금지)
data.forEach((r, i) =>
  console.log(
    `${String(i + 1).padStart(3)}. ${r.name}  ${phone(r.phone)}  [${r.followup_consented_at ? "후기·구매 연락 가능" : "배송 연락만"}]  (${SOURCE[r.source]}, ${when(r.created_at)})`,
  ),
);
