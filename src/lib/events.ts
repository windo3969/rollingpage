"use server";

import { getRoomByHostToken, getRoomByResultId } from "./rooms";
import { createAdminClient } from "./supabase/admin";

export type PdfInterestSource = "result" | "host";

// 포토북 PDF 수요 기록. key는 source에 따라 결과 ID 또는 주최자 토큰이며,
// 서버에서 방을 찾아 room_id만 저장한다 (토큰·ID 원문은 기록하지 않음).
export async function recordPdfInterest(source: PdfInterestSource, key: string): Promise<void> {
  if (source !== "result" && source !== "host") return;

  const room = source === "result" ? await getRoomByResultId(key) : await getRoomByHostToken(key);
  if (!room) return;

  const { error } = await createAdminClient()
    .from("events")
    .insert({ name: "pdf_interest", source, room_id: room.id });
  if (error) console.error("recordPdfInterest failed", error);
}
