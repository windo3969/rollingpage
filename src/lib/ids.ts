import { nanoid } from "nanoid";

// 방 ID: 공유 링크에 노출된다. 21자 nanoid ≈ 126bit 엔트로피 (CLAUDE.md: 최소 16자)
export const newRoomId = () => nanoid(21);

// 주최자 토큰: 주최자 링크에만 존재하고 DB에는 해시만 저장한다.
export const newHostToken = () => nanoid(32);
