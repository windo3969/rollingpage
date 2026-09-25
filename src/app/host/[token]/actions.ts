"use server";

import { revalidatePath } from "next/cache";
import { PARTICIPANT_MAX, PARTICIPANT_NAME_MAX_LENGTH } from "@/lib/limits";
import { getParticipants, getRoomByHostToken } from "@/lib/rooms";
import { createAdminClient } from "@/lib/supabase/admin";
import { isTemplateId } from "@/lib/templates";

// 모든 주최자 액션은 주최자 토큰으로만 실행된다 (토큰 → 해시 → 방 조회로 권한 확인)

export async function setTemplate(token: string, formData: FormData) {
  const template = String(formData.get("template") ?? "");
  if (!isTemplateId(template)) return;

  const room = await getRoomByHostToken(token);
  if (!room) return;

  const { error } = await createAdminClient().from("rooms").update({ template }).eq("id", room.id);
  if (error) console.error("setTemplate failed", error);

  revalidatePath(`/host/${token}`);
}

// ─── 참여자 명단 ─────────────────────────────────────

export type AddParticipantsState = { error?: string; added?: number };

export async function addParticipants(
  token: string,
  _prev: AddParticipantsState,
  formData: FormData,
): Promise<AddParticipantsState> {
  const room = await getRoomByHostToken(token);
  if (!room) return { error: "방을 찾을 수 없어요." };

  // 줄바꿈·쉼표로 구분된 이름들. 앞뒤 공백 제거, 빈 값·중복 제거
  const names = [
    ...new Set(
      String(formData.get("names") ?? "")
        .split(/[\n,]/)
        .map((name) => name.trim())
        .filter(Boolean),
    ),
  ];
  if (names.length === 0) return { error: "이름을 입력해주세요." };

  const tooLong = names.find((name) => name.length > PARTICIPANT_NAME_MAX_LENGTH);
  if (tooLong) return { error: `이름은 ${PARTICIPANT_NAME_MAX_LENGTH}자 이하로 입력해주세요. (${tooLong.slice(0, 10)}…)` };

  const existing = new Set((await getParticipants(room.id)).map((p) => p.name));
  const fresh = names.filter((name) => !existing.has(name));
  if (fresh.length === 0) return { error: "이미 명단에 있는 이름이에요." };
  if (existing.size + fresh.length > PARTICIPANT_MAX)
    return { error: `명단은 최대 ${PARTICIPANT_MAX}명까지 만들 수 있어요.` };

  const { error } = await createAdminClient()
    .from("participants")
    .upsert(
      fresh.map((name) => ({ room_id: room.id, name })),
      { onConflict: "room_id,name", ignoreDuplicates: true }, // 동시에 같은 이름을 넣어도 안전하게
    );
  if (error) {
    console.error("addParticipants failed", error);
    return { error: "명단을 저장하지 못했어요. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath(`/host/${token}`);
  return { added: fresh.length };
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function removeParticipant(token: string, participantId: string) {
  if (!UUID_PATTERN.test(participantId)) return;
  const room = await getRoomByHostToken(token);
  if (!room) return;

  // room_id 조건을 같이 걸어, 다른 방의 참여자는 지울 수 없게 한다
  const { error } = await createAdminClient()
    .from("participants")
    .delete()
    .eq("id", participantId)
    .eq("room_id", room.id);
  if (error) console.error("removeParticipant failed", error);

  revalidatePath(`/host/${token}`);
}
