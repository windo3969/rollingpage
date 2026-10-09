"use server";

import { checkRateLimit, RATE_LIMIT_MESSAGE } from "./rateLimit";
import { createAdminClient } from "./supabase/admin";

// 익명 피드백. 화면 종류만 남기고, 누가·어느 방에서 보냈는지는 저장하지 않는다.
export type FeedbackPage = "write" | "result" | "host";
export type FeedbackRating = "good" | "okay" | "bad";
export type FeedbackState = { done?: boolean; error?: string };

const PAGES: FeedbackPage[] = ["write", "result", "host"];
const RATINGS: FeedbackRating[] = ["good", "okay", "bad"];
const MAX_LENGTH = 1000;

export async function submitFeedback(page: FeedbackPage, _prev: FeedbackState, formData: FormData): Promise<FeedbackState> {
  if (!PAGES.includes(page)) return { error: "다시 시도해주세요." };

  const rawRating = String(formData.get("rating") ?? "");
  const rating = RATINGS.includes(rawRating as FeedbackRating) ? rawRating : null;
  const message = String(formData.get("message") ?? "").trim() || null;

  if (!rating && !message) return { error: "평가를 고르거나 의견을 적어주세요." };
  if (message && message.length > MAX_LENGTH) return { error: `의견은 ${MAX_LENGTH}자까지 적을 수 있어요.` };

  if (!(await checkRateLimit("feedback"))) return { error: RATE_LIMIT_MESSAGE };

  const { error } = await createAdminClient().from("feedback").insert({ page, rating, message });
  if (error) {
    console.error("submitFeedback failed", error);
    return { error: "보내지 못했어요. 잠시 후 다시 시도해주세요." };
  }
  return { done: true };
}
