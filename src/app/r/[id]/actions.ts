"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { verifyPassword } from "@/lib/hash";
import { MESSAGE_MAX_LENGTH, AUTHOR_MAX_LENGTH, PHOTO_MAX_BYTES } from "@/lib/limits";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rateLimit";
import { getRoom, grantRoomAccess, hasRoomAccess, isClosed } from "@/lib/rooms";
import { createAdminClient } from "@/lib/supabase/admin";

// ─── 비밀번호 확인 ───────────────────────────────────

export type UnlockState = { error?: string };

export async function unlockRoom(roomId: string, _prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const room = await getRoom(roomId);
  if (!room?.password_hash) return { error: "롤링페이퍼를 찾을 수 없어요." };

  // 비밀번호 대입 방지: IP별 + 방 전체 두 가지로 제한
  const allowed =
    (await checkRateLimit("unlockPerIp", room.id)) && (await checkRateLimit("unlockPerRoom", room.id, { perIp: false }));
  if (!allowed) return { error: "비밀번호를 너무 많이 시도했어요. 15분 뒤에 다시 시도해주세요." };

  const password = String(formData.get("password") ?? "");
  if (!(await verifyPassword(password, room.password_hash))) return { error: "비밀번호가 맞지 않아요." };

  await grantRoomAccess(room);
  revalidatePath(`/r/${room.id}`);
  return {};
}

// ─── 메시지 작성 ─────────────────────────────────────

export type SubmitState = {
  done?: boolean;
  error?: string;
  // participantId: 명단에서 고른 참여자 ID, "" = 명단에 없어요, null = 명단 없는 방
  values?: { authorName: string; content: string; participantId: string | null };
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// 확장자·Content-Type을 믿지 않고 파일 앞부분(매직 바이트)으로 형식을 판별한다
function detectImageType(bytes: Uint8Array): { mime: string; ext: string } | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
    return { mime: "image/png", ext: "png" };
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { mime: "image/webp", ext: "webp" };
  return null;
}

export async function submitMessage(roomId: string, _prev: SubmitState, formData: FormData): Promise<SubmitState> {
  let authorName = String(formData.get("authorName") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const photo = formData.get("photo");
  const rawParticipantId = formData.get("participantId");
  const participantId = rawParticipantId === null ? null : String(rawParticipantId);
  const values = { authorName, content, participantId };

  // 페이지에서 확인했더라도 서버에서 방 상태·권한을 다시 확인한다
  const room = await getRoom(roomId);
  if (!room) return { error: "롤링페이퍼를 찾을 수 없어요.", values };
  if (isClosed(room)) return { error: "작성 기간이 끝났어요.", values };
  if (!(await hasRoomAccess(room))) return { error: "비밀번호를 다시 입력해주세요.", values };

  if (content.length < 1 || content.length > MESSAGE_MAX_LENGTH)
    return { error: `메시지는 1~${MESSAGE_MAX_LENGTH}자로 작성해주세요.`, values };

  const supabase = createAdminClient();

  // 명단에서 이름을 골랐다면, 그 참여자가 이 방 명단에 있는지 서버에서 확인하고 이름도 명단 값을 쓴다
  let linkedParticipantId: string | null = null;
  if (participantId) {
    if (!UUID_PATTERN.test(participantId)) return { error: "이름을 다시 골라주세요.", values };
    const { data: participant } = await supabase
      .from("participants")
      .select("id, name")
      .eq("id", participantId)
      .eq("room_id", room.id)
      .maybeSingle();
    if (!participant) return { error: "명단이 바뀌었어요. 새로고침 후 이름을 다시 골라주세요.", values };
    linkedParticipantId = participant.id;
    authorName = participant.name;
  }

  if (authorName.length < 1 || authorName.length > AUTHOR_MAX_LENGTH)
    return { error: `이름은 1~${AUTHOR_MAX_LENGTH}자로 입력해주세요.`, values };

  if (!(await checkRateLimit("submitMessage", room.id))) return { error: RATE_LIMIT_MESSAGE, values };
  let photoPath: string | null = null;

  if (photo instanceof File && photo.size > 0) {
    if (photo.size > PHOTO_MAX_BYTES) return { error: "사진 용량이 너무 커요. 다른 사진을 골라주세요.", values };
    const bytes = new Uint8Array(await photo.arrayBuffer());
    const type = detectImageType(bytes);
    if (!type) return { error: "JPG, PNG, WEBP 사진만 올릴 수 있어요.", values };

    // 경로는 서버가 정한다. 방 ID 폴더 아래 추측 불가능한 파일명
    photoPath = `${room.id}/${randomUUID()}.${type.ext}`;
    const { error } = await supabase.storage
      .from("photos")
      .upload(photoPath, bytes, { contentType: type.mime, upsert: false });
    if (error) {
      console.error("photo upload failed", error);
      return { error: "사진을 올리지 못했어요. 잠시 후 다시 시도해주세요.", values };
    }
  }

  const { error } = await supabase.from("messages").insert({
    room_id: room.id,
    participant_id: linkedParticipantId,
    author_name: authorName,
    content,
    photo_path: photoPath,
  });

  if (error) {
    console.error("submitMessage failed", error);
    // 메시지 저장에 실패하면 올려둔 사진도 지워서 고아 파일을 남기지 않는다
    if (photoPath) await supabase.storage.from("photos").remove([photoPath]);
    return { error: "메시지를 저장하지 못했어요. 잠시 후 다시 시도해주세요.", values };
  }

  return { done: true };
}
