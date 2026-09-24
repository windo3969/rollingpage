import "server-only";
import { cookies } from "next/headers";
import { hashToken, safeEqual } from "./hash";
import { createAdminClient } from "./supabase/admin";

export type Room = {
  id: string;
  title: string;
  recipient_name: string;
  deadline: string;
  password_hash: string | null;
};

const ROOM_ID_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;

export async function getRoom(id: string): Promise<Room | null> {
  // 형식이 맞지 않는 ID는 DB까지 가지 않는다
  if (!ROOM_ID_PATTERN.test(id)) return null;
  const { data } = await createAdminClient()
    .from("rooms")
    .select("id, title, recipient_name, deadline, password_hash")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export const isClosed = (room: Room) => new Date(room.deadline).getTime() < Date.now();

// ─── 비밀번호 방 접근 쿠키 ───────────────────────────
// 값 = SHA-256(방 ID + password_hash). password_hash는 서버에만 있으므로 클라이언트가 위조할 수 없고,
// 주최자가 비밀번호를 바꾸면(해시가 바뀌면) 기존 쿠키는 자동으로 무효가 된다.
const accessCookieName = (roomId: string) => `room_access_${roomId}`;
const accessCookieValue = (room: Room) => hashToken(`room-access:${room.id}:${room.password_hash}`);

export async function hasRoomAccess(room: Room): Promise<boolean> {
  if (!room.password_hash) return true;
  const value = (await cookies()).get(accessCookieName(room.id))?.value;
  return value !== undefined && safeEqual(value, accessCookieValue(room));
}

export async function grantRoomAccess(room: Room) {
  (await cookies()).set(accessCookieName(room.id), accessCookieValue(room), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/r/${room.id}`,
    maxAge: 60 * 60 * 24 * 30,
  });
}
