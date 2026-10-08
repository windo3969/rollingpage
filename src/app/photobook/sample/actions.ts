"use server";

import { revalidatePath } from "next/cache";
import { isPhotobookSource, normalizePhone, PHOTOBOOK_EVENT } from "@/lib/photobook";
import { countPhotobookRequests } from "@/lib/photobookRequests";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rateLimit";
import { createAdminClient } from "@/lib/supabase/admin";

export type RequestState = {
  done?: boolean;
  error?: string;
  values?: { name: string; phone: string };
};

export async function requestPhotobook(_prev: RequestState, formData: FormData): Promise<RequestState> {
  const name = String(formData.get("name") ?? "").trim();
  const rawPhone = String(formData.get("phone") ?? "");
  const rawSource = String(formData.get("source") ?? "");
  const values = { name, phone: rawPhone };

  if (name.length < 1 || name.length > 30) return { error: "이름(닉네임)은 1~30자로 입력해주세요.", values };
  const phone = normalizePhone(rawPhone);
  if (!phone) return { error: "휴대폰 번호를 다시 확인해주세요. (예: 010-1234-5678)", values };
  if (formData.get("consent") !== "on") return { error: "개인정보 수집·이용에 동의해야 신청할 수 있어요.", values };

  if (!(await checkRateLimit("photobookRequest"))) return { error: RATE_LIMIT_MESSAGE, values };

  if ((await countPhotobookRequests()) >= PHOTOBOOK_EVENT.freeQuota)
    return { error: "아쉽지만 선착순 무료 제작이 마감되었어요.", values };

  const { error } = await createAdminClient()
    .from("photobook_requests")
    .insert({
      name,
      phone,
      source: isPhotobookSource(rawSource) ? rawSource : "direct",
      consented_at: new Date().toISOString(),
    });

  if (error) {
    if (error.code === "23505") return { error: "이미 신청된 번호예요. 곧 연락드릴게요!", values }; // unique 위반
    console.error("requestPhotobook failed", error);
    return { error: "신청하지 못했어요. 잠시 후 다시 시도해주세요.", values };
  }

  revalidatePath("/photobook/sample"); // 남은 자리 숫자 갱신
  return { done: true };
}
