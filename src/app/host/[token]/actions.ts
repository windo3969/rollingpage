"use server";

import { revalidatePath } from "next/cache";
import { getRoomByHostToken } from "@/lib/rooms";
import { createAdminClient } from "@/lib/supabase/admin";
import { isTemplateId } from "@/lib/templates";

// 주최자 토큰으로만 변경 가능 (토큰 → 해시 → 방 조회로 권한 확인)
export async function setTemplate(token: string, formData: FormData) {
  const template = String(formData.get("template") ?? "");
  if (!isTemplateId(template)) return;

  const room = await getRoomByHostToken(token);
  if (!room) return;

  const { error } = await createAdminClient().from("rooms").update({ template }).eq("id", room.id);
  if (error) console.error("setTemplate failed", error);

  revalidatePath(`/host/${token}`);
}
