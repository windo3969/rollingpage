// 실물 포토북(소책자) 무료 제작 이벤트 설정. 정원·가격을 바꿀 때는 여기만 고친다.
export const PHOTOBOOK_EVENT = {
  price: 5000, // 이벤트 후 예상 판매가 (원)
  freeQuota: 200, // 선착순 무료 제작 인원
};

export type PhotobookSource = "result" | "host" | "direct";

export const isPhotobookSource = (value: string): value is PhotobookSource =>
  value === "result" || value === "host" || value === "direct";

// 010-1234-5678, 01012345678, 010 1234 5678 → 01012345678 (형식이 맞지 않으면 null)
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  return /^01[016789]\d{7,8}$/.test(digits) ? digits : null;
}
