// 서비스 통계: npm run stats            (실제 데이터만, 데모 방 제외)
//              npm run stats -- --include-demo   (데모 방 포함, 스크립트 확인용)
// 개인정보(방 제목, 이름, 메시지 내용)는 출력하지 않고 숫자만 보여준다.
import { createClient } from "@supabase/supabase-js";

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const includeDemo = process.argv.includes("--include-demo");
const DAY = 24 * 60 * 60 * 1000;

// Supabase는 한 번에 최대 1000행까지 돌려주므로 나눠서 모두 가져온다
async function all(table, columns) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await admin.from(table).select(columns).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
}

const isDemo = (roomId) => roomId?.startsWith("DEMO");
const keep = (roomId) => includeDemo || !isDemo(roomId);

const [roomsAll, messagesAll, participantsAll, eventsAll] = await Promise.all([
  all("rooms", "id, created_at, deadline, password_hash, template"),
  all("messages", "room_id, participant_id, photo_path"),
  all("participants", "id, room_id"),
  all("events", "name, source, room_id, created_at"),
]);

const rooms = roomsAll.filter((r) => keep(r.id));
const roomIds = new Set(rooms.map((r) => r.id));
const messages = messagesAll.filter((m) => roomIds.has(m.room_id));
const participants = participantsAll.filter((p) => roomIds.has(p.room_id));
// 방이 삭제된 이벤트(room_id null)는 실제 수요로 보고 포함한다
const events = eventsAll.filter((e) => e.room_id === null || roomIds.has(e.room_id));

const now = Date.now();
const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(0)}%` : "-");
const avg = (arr) => (arr.length ? (arr.reduce((s, x) => s + x, 0) / arr.length).toFixed(1) : "-");
const median = (arr) => {
  if (!arr.length) return "-";
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : ((s[mid - 1] + s[mid]) / 2).toFixed(1);
};
const groupCount = (items, key) => items.reduce((m, x) => m.set(key(x), (m.get(key(x)) ?? 0) + 1), new Map());

// ─── 방 ─────────────────────────────────────────────
const open = rooms.filter((r) => new Date(r.deadline).getTime() >= now);
const recent7 = rooms.filter((r) => now - new Date(r.created_at).getTime() <= 7 * DAY);
const withPassword = rooms.filter((r) => r.password_hash);
const templates = groupCount(rooms, (r) => r.template);

// ─── 메시지 ─────────────────────────────────────────
const msgsByRoom = groupCount(messages, (m) => m.room_id);
const perRoom = rooms.map((r) => msgsByRoom.get(r.id) ?? 0);
const emptyRooms = perRoom.filter((n) => n === 0).length;
const withPhoto = messages.filter((m) => m.photo_path);

// ─── 명단 (Phase 2) ─────────────────────────────────
const participantsByRoom = groupCount(participants, (p) => p.room_id);
const listedRooms = rooms.filter((r) => participantsByRoom.has(r.id));
const writtenIds = new Set(messages.map((m) => m.participant_id).filter(Boolean));
const completionRates = listedRooms.map((r) => {
  const people = participants.filter((p) => p.room_id === r.id);
  return people.filter((p) => writtenIds.has(p.id)).length / people.length;
});
const msgsInListedRooms = messages.filter((m) => participantsByRoom.has(m.room_id));
const unlisted = msgsInListedRooms.filter((m) => !m.participant_id);

// ─── 포토북 미리보기 ─────────────────────────────────
const interest = events.filter((e) => e.name === "pdf_interest");
const interestRooms = new Set(interest.map((e) => e.room_id).filter(Boolean));

// ─── 사진 파일 점검: DB에는 사진이 있는데 저장소에 파일이 없는 경우 ───
const photoRoomIds = [...new Set(withPhoto.map((m) => m.room_id))];
const stored = new Set();
for (const id of photoRoomIds) {
  const { data, error } = await admin.storage.from("photos").list(id, { limit: 1000 });
  if (error) throw new Error(`storage: ${error.message}`);
  for (const f of data) stored.add(`${id}/${f.name}`);
}
const missingPhotos = withPhoto.filter((m) => !stored.has(m.photo_path));

// ─── 출력 ───────────────────────────────────────────
// 터미널에서 한글은 두 칸을 차지하므로 표시 폭 기준으로 맞춘다
const width = (s) => [...s].reduce((w, ch) => w + (/[ᄀ-ᇿ㄰-㆏가-힣]/.test(ch) ? 2 : 1), 0);
const line = (label, value) => console.log(`  ${label}${" ".repeat(Math.max(1, 24 - width(label)))}${value}`);
console.log(`\n롤링페이퍼 통계 ${includeDemo ? "(데모 방 포함)" : "(데모 방 제외)"}\n`);

console.log("방");
line("전체", `${rooms.length}개 (최근 7일 ${recent7.length}개)`);
line("진행중 / 마감", `${open.length}개 / ${rooms.length - open.length}개`);
line("비밀번호 설정", `${withPassword.length}개 (${pct(withPassword.length, rooms.length)})`);
line("템플릿", [...templates].map(([t, n]) => `${t} ${n}`).join(", ") || "-");

console.log("\n메시지");
line("전체", `${messages.length}개`);
line("방당 평균 / 중앙값", perRoom.length ? `${avg(perRoom)}개 / ${median(perRoom)}개` : "-");
line("메시지 0개인 방", `${emptyRooms}개 (${pct(emptyRooms, rooms.length)})`);
line("사진 첨부", `${withPhoto.length}개 (${pct(withPhoto.length, messages.length)})`);

console.log("\n참여자 명단");
line("명단을 쓴 방", `${listedRooms.length}개 (${pct(listedRooms.length, rooms.length)})`);
line("평균 작성률", completionRates.length ? pct(completionRates.reduce((s, x) => s + x, 0), completionRates.length) : "-");
line("명단 외 작성 메시지", `${unlisted.length}개 (명단 방 메시지 중 ${pct(unlisted.length, msgsInListedRooms.length)})`);

console.log("\n포토북 미리보기");
line("클릭", `${interest.length}회 (결과 페이지 ${interest.filter((e) => e.source === "result").length} · 주최자 ${interest.filter((e) => e.source === "host").length})`);
line("클릭이 있는 방", `${interestRooms.size}개 / ${rooms.length}개 (${pct(interestRooms.size, rooms.length)})`);

console.log("\n점검");
line("사진 파일 누락", missingPhotos.length ? `✗ ${missingPhotos.length}개 (메시지는 있는데 파일이 없음)` : "✓ 없음");
console.log("");
