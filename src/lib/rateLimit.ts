import "server-only";
import { headers } from "next/headers";
import { hashToken } from "./hash";
import { createAdminClient } from "./supabase/admin";

// 요청 횟수 제한 정책. 모바일 통신사는 여러 사람이 같은 IP를 쓰는 경우가 많아 넉넉하게 잡는다.
const LIMITS = {
  createRoom: { limit: 20, windowSeconds: 60 * 60 }, // IP당 시간당 방 20개
  unlockPerIp: { limit: 10, windowSeconds: 15 * 60 }, // IP·방당 15분에 비밀번호 10회
  unlockPerRoom: { limit: 30, windowSeconds: 15 * 60 }, // 방 전체 15분에 비밀번호 30회 (분산 대입 방지)
  submitMessage: { limit: 20, windowSeconds: 10 * 60 }, // IP·방당 10분에 메시지 20개
} as const;

type Bucket = keyof typeof LIMITS;

// Vercel이 설정하는 헤더 기준. IP 원문은 저장하지 않고 해시만 키로 쓴다.
async function clientIpHash(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return hashToken(`ip:${ip}`);
}

// scope: 같은 버킷 안에서 대상을 나눌 때 (예: 방 ID). 허용이면 true.
export async function checkRateLimit(bucket: Bucket, scope = "", { perIp = true } = {}): Promise<boolean> {
  const { limit, windowSeconds } = LIMITS[bucket];
  const key = [bucket, scope, perIp ? await clientIpHash() : ""].join(":");

  const { data, error } = await createAdminClient().rpc("check_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  // 제한 기능 장애로 서비스 전체가 멈추지 않도록, 오류 시에는 허용하고 기록만 남긴다
  if (error) {
    console.error("checkRateLimit failed", error);
    return true;
  }
  return data === true;
}

export const RATE_LIMIT_MESSAGE = "요청이 너무 많아요. 잠시 후 다시 시도해주세요.";
