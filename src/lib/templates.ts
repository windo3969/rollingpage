// 결과 페이지 템플릿. DB rooms.template의 check 제약과 키를 맞춘다.
// cards: 메시지 카드 배경색 (순서대로 돌아가며 사용)
export const TEMPLATES = {
  paper: {
    name: "파스텔 카드",
    page: "bg-cream",
    cards: ["bg-pastel-pink", "bg-pastel-yellow", "bg-pastel-sky", "bg-pastel-lavender"],
    swatch: "bg-pastel-pink",
  },
  pastel: {
    name: "하늘 배경",
    page: "bg-pastel-sky",
    cards: ["bg-white"],
    swatch: "bg-pastel-sky",
  },
} as const;

export type TemplateId = keyof typeof TEMPLATES;

export const isTemplateId = (value: string): value is TemplateId => value in TEMPLATES;
