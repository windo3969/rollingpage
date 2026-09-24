// 결과 페이지 확인용 데모 방 만들기: npm run seed:demo
// 삭제: npm run seed:demo -- --clean
// 데모 방 ID는 DEMO로 시작한다.
import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const base = process.env.DEMO_BASE_URL ?? "http://localhost:3000";

async function clean() {
  const { data: rooms } = await admin.from("rooms").select("id").like("id", "DEMO%");
  for (const { id } of rooms ?? []) {
    const { data: files } = await admin.storage.from("photos").list(id);
    if (files?.length) await admin.storage.from("photos").remove(files.map((f) => `${id}/${f.name}`));
  }
  const { count } = await admin.from("rooms").delete({ count: "exact" }).like("id", "DEMO%");
  console.log(`데모 방 ${count ?? 0}개 삭제`);
}

// 사진 대용 단색 1x1 PNG (외부 이미지 없이 직접 인코딩, 화면에서는 늘어나 보인다)
function solidPng(r, g, b) {
  return import("node:zlib").then(({ deflateSync, crc32 }) => {
    const chunk = (type, data) => {
      const len = Buffer.alloc(4);
      len.writeUInt32BE(data.length);
      const body = Buffer.concat([Buffer.from(type), data]);
      const crc = Buffer.alloc(4);
      crc.writeUInt32BE(crc32(body));
      return Buffer.concat([len, body, crc]);
    };
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(1, 0);
    ihdr.writeUInt32BE(1, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 2; // RGB
    return Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk("IHDR", ihdr),
      chunk("IDAT", deflateSync(Buffer.from([0, r, g, b]))),
      chunk("IEND", Buffer.alloc(0)),
    ]);
  });
}

const MESSAGES = [
  { author: "수연", content: "생일 축하해!! 🎉" },
  { author: "민지", content: "지민아! 항상 밝고 좋은 에너지 주는 너라서 너무 고마워. 앞으로도 쭉 행복하자 :)", photo: [251, 200, 200] },
  { author: "지훈", content: "너의 모든 날을 응원해" },
  {
    author: "하은",
    content:
      "지민아, 올해도 네 생일을 같이 축하할 수 있어서 정말 기뻐. 처음 만났던 날 기억나? 그때는 이렇게 오래 친구가 될 줄 몰랐는데, 어느새 서로의 가장 가까운 사람이 됐네. 힘들 때마다 옆에 있어줘서 고마워. 이번 해에는 네가 하고 싶은 일들 전부 이뤄지길!",
    photo: [255, 214, 165],
  },
  { author: "준호", content: "맛있는 거 먹으러 가자 🍰 내가 쏠게!" },
  {
    author: "서연",
    content:
      "생일 진심으로 축하해! 요즘 바빠서 자주 못 봤지만 늘 생각하고 있어.\n다음 달에 꼭 보자.\n\n선물은 만나서 줄게 😉",
  },
  { author: "도윤", content: "HBD 🎂", photo: [200, 225, 240] },
];

async function seed() {
  const id = `DEMO${randomBytes(9).toString("hex")}`;
  const hostToken = randomBytes(24).toString("base64url"); // 32자
  const { data: room, error } = await admin
    .from("rooms")
    .insert({
      id,
      title: "지민이의 생일 축하해!",
      recipient_name: "지민",
      deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
      host_token_hash: createHash("sha256").update(hostToken).digest("hex"),
    })
    .select("result_id")
    .single();
  if (error) throw error;

  for (const m of MESSAGES) {
    let photoPath = null;
    if (m.photo) {
      photoPath = `${id}/${randomBytes(8).toString("hex")}.png`;
      const png = await solidPng(...m.photo);
      const up = await admin.storage.from("photos").upload(photoPath, png, { contentType: "image/png" });
      if (up.error) throw up.error;
    }
    const ins = await admin.from("messages").insert({ room_id: id, author_name: m.author, content: m.content, photo_path: photoPath });
    if (ins.error) throw ins.error;
  }

  console.log(`데모 방 생성 (메시지 ${MESSAGES.length}개)`);
  console.log(`  작성:   ${base}/r/${id}`);
  console.log(`  결과:   ${base}/v/${room.result_id}`);
  console.log(`  주최자: ${base}/host/${hostToken}`);
}

if (process.argv.includes("--clean")) await clean();
else await seed();
