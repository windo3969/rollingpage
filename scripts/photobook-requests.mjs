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
  .select("name, phone, source, created_at, marketing_consented_at, rooms(result_id)")
  .order("created_at", { ascending: true });
if (error) throw error;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rollingpage.vercel.app";
const SOURCE = { result: "결과 페이지", host: "주최자 페이지", direct: "직접 방문" };
const phone = (p) => p.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
const when = (s) => new Date(s).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

const marketing = data.filter((r) => r.marketing_consented_at).length;
console.log(`포토북 PDF 신청 ${data.length}명 (실물 할인 소식 동의 ${marketing}명)\n`);
// 모두에게: PDF 전달, 수령 확인, 후기 요청 연락 가능 (필수 동의)
// "할인 안내 가능"인 사람에게만: 실물 소책자 상품·할인 안내 (광고성 정보, 선택 동의)
data.forEach((r, i) => {
  console.log(
    `${String(i + 1).padStart(3)}. ${r.name}  ${phone(r.phone)}  [${r.marketing_consented_at ? "할인 안내 가능" : "PDF·후기 연락만"}]  (${SOURCE[r.source]}, ${when(r.created_at)})`,
  );
  // PDF를 만들 롤링페이퍼 (직접 방문했거나 방이 삭제됐으면 없음)
  console.log(`     롤링페이퍼: ${r.rooms ? `${SITE}/v/${r.rooms.result_id}` : "연결된 방 없음 (연락할 때 확인)"}`);
});
