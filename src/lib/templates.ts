// 결과 페이지 템플릿. DB rooms.template의 check 제약과 키를 맞춘다.
export const TEMPLATES = {
  paper: {
    name: "크림 종이",
    page: "bg-cream",
    card: "bg-paper",
    swatch: "bg-paper",
  },
  pastel: {
    name: "파스텔 하늘",
    page: "bg-pastel-sky",
    card: "bg-white",
    swatch: "bg-pastel-sky",
  },
} as const;

export type TemplateId = keyof typeof TEMPLATES;

export const isTemplateId = (value: string): value is TemplateId => value in TEMPLATES;

// 메시지 카드 상단 마스킹테이프 색 (순서대로 돌아가며 사용)
export const TAPE_COLORS = ["bg-pastel-pink", "bg-pastel-yellow", "bg-pastel-mint", "bg-pastel-sky"];
