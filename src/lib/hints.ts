// 글감 힌트 (CLAUDE.md Phase 2-5): 관계 기반 질문형 프롬프트.
// AI 생성 문장이 아니라 직접 쓴 질문이며, 메시지에 끼워 넣지 않고 떠올리는 데만 쓴다.

export const RELATIONSHIPS = ["전체", "친구", "가족", "연인", "동료·선후배"] as const;
export type Relationship = (typeof RELATIONSHIPS)[number];

const COMMON = [
  "이 사람과 있었던 가장 재밌는 에피소드는?",
  "처음 만났을 때 첫인상은 어땠나요?",
  "요즘 이 사람에게 고마웠던 순간은?",
  "이 사람의 어떤 점이 제일 좋아요?",
  "올해 이 사람에게 꼭 일어났으면 하는 좋은 일은?",
  "같이 해보고 싶은 것이 있다면?",
];

const BY_RELATIONSHIP: Record<Exclude<Relationship, "전체">, string[]> = {
  친구: [
    "같이 가장 많이 웃었던 날은 언제였나요?",
    "둘만 아는 추억이나 별명이 있나요?",
    "힘들 때 이 친구가 해준 말 중 기억에 남는 것은?",
    "다음에 같이 가고 싶은 곳은?",
  ],
  가족: [
    "어릴 적 함께한 기억 중 떠오르는 장면은?",
    "평소에 쑥스러워서 못 한 말이 있다면?",
    "닮고 싶은 점이 있다면?",
    "올해 함께 하고 싶은 일은?",
  ],
  연인: [
    "처음 설렜던 순간은 언제였나요?",
    "함께한 날 중 가장 기억에 남는 하루는?",
    "요즘 가장 사랑스러웠던 순간은?",
    "앞으로 같이 하고 싶은 것은?",
  ],
  "동료·선후배": [
    "함께 일하거나 공부하며 도움받았던 순간은?",
    "이 사람 덕분에 힘이 났던 날이 있나요?",
    "이 사람에게 배운 점이 있다면?",
    "다음에 같이 밥 먹으면 하고 싶은 이야기는?",
  ],
};

// 관계별 질문 + 공통 질문. "전체"는 모두.
export function hintsFor(relationship: Relationship): string[] {
  if (relationship === "전체") return [...COMMON, ...Object.values(BY_RELATIONSHIP).flat()];
  return [...BY_RELATIONSHIP[relationship], ...COMMON];
}
