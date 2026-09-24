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
  result_id: string;
  template: string;
};

export type Message = {
  id: string;
  author_name: string;
  content: string;
  photo_path: string | null;
  created_at: string;
};

const ROOM_COLUMNS = "id, title, recipient_name, deadline, password_hash, result_id, template";

// 형식이 맞지 않는 ID·토큰은 DB까지 가지 않는다
const ROOM_ID_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;
const RESULT_ID_PATTERN = /^[a-f0-9]{32}$/;
const HOST_TOKEN_PATTERN = /^[A-Za-z0-9_-]{32}$/;

async function findRoom(column: "id" | "result_id" | "host_token_hash", value: string): Promise<Room | null> {
  const { data } = await createAdminClient().from("rooms").select(ROOM_COLUMNS).eq(column, value).maybeSingle();
  return data;
}

export async function getRoom(id: string) {
  return ROOM_ID_PATTERN.test(id) ? findRoom("id", id) : null;
}

export async function getRoomByResultId(resultId: string) {
  return RESULT_ID_PATTERN.test(resultId) ? findRoom("result_id", resultId) : null;
}

export async function getRoomByHostToken(token: string) {
  return HOST_TOKEN_PATTERN.test(token) ? findRoom("host_token_hash", hashToken(token)) : null;
}

export async function getMessages(roomId: string): Promise<Message[]> {
  const { data, error } = await createAdminClient()
    .from("messages")
    .select("id, author_name, content, photo_path, created_at")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function countMessages(roomId: string): Promise<number> {
  const { count, error } = await createAdminClient()
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("room_id", roomId);
  if (error) throw error;
  return count ?? 0;
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
