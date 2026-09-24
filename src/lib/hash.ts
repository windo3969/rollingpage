import "server-only";
import { createHash, randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

// 방 비밀번호: 사람이 정한 짧은 값이므로 느린 해시(scrypt) + 랜덤 salt.
// 저장 형식: scrypt$<salt hex>$<hash hex>
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

// 주최자 토큰: 충분히 긴 랜덤 값이므로 빠른 해시(SHA-256)로 충분하고, 조회 키로 쓸 수 있다.
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
