"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword, hashToken } from "@/lib/hash";
import { newHostToken, newRoomId } from "@/lib/ids";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rateLimit";

export type CreateRoomState = {
  error?: string;
  values?: { title: string; recipientName: string; deadline: string };
};

const MAX_DEADLINE_DAYS = 365;
const DAY_MS = 24 * 60 * 60 * 1000;

export async function createRoom(_prev: CreateRoomState, formData: FormData): Promise<CreateRoomState> {
  const title = String(formData.get("title") ?? "").trim();
  const recipientName = String(formData.get("recipientName") ?? "").trim();
  const deadline = String(formData.get("deadline") ?? "");
  const password = String(formData.get("password") ?? "");
  const values = { title, recipientName, deadline };

  if (recipientName.length < 1 || recipientName.length > 50)
    return { error: "받는 사람 이름은 1~50자로 입력해주세요.", values };
  if (title.length < 1 || title.length > 100) return { error: "제목은 1~100자로 입력해주세요.", values };
  if (password && (password.length < 4 || password.length > 50))
    return { error: "비밀번호는 4~50자로 입력해주세요.", values };

  // 마감일은 날짜만 받고, 한국 시간 기준 그날 23:59:59까지 작성 가능하게 한다.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return { error: "마감일을 선택해주세요.", values };
  const deadlineAt = new Date(`${deadline}T23:59:59+09:00`).getTime();
  const now = Date.now();
  if (Number.isNaN(deadlineAt) || deadlineAt < now) return { error: "마감일은 오늘 이후로 선택해주세요.", values };
  if (deadlineAt > now + MAX_DEADLINE_DAYS * DAY_MS)
    return { error: `마감일은 ${MAX_DEADLINE_DAYS}일 이내로 선택해주세요.`, values };

  if (!(await checkRateLimit("createRoom"))) return { error: RATE_LIMIT_MESSAGE, values };

  const hostToken = newHostToken();
  const { error } = await createAdminClient()
    .from("rooms")
    .insert({
      id: newRoomId(),
      title,
      recipient_name: recipientName,
      deadline: new Date(deadlineAt).toISOString(),
      password_hash: password ? await hashPassword(password) : null,
      host_token_hash: hashToken(hostToken),
    });

  if (error) {
    console.error("createRoom failed", error);
    return { error: "방을 만들지 못했어요. 잠시 후 다시 시도해주세요.", values };
  }

  redirect(`/host/${hostToken}`);
}
