// 공통 스타일 클래스 — docs/design/DESIGN.md의 컴포넌트 규칙

export const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-rose px-6 py-4 text-base font-semibold text-white " +
  "transition-colors active:bg-rose-deep disabled:bg-rose-soft";

export const buttonSmall =
  "shrink-0 rounded-full bg-rose px-4 py-2 text-sm font-medium text-white transition-colors active:bg-rose-deep";

export const input =
  "w-full rounded-lg border border-line bg-white px-4 py-3 text-base text-ink outline-none " +
  "placeholder:text-ink-muted/70 focus:border-rose";

export const label = "text-sm font-medium text-ink";

export const hint = "text-xs text-ink-muted";

export const card = "rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(61,54,50,0.06)]";

export const errorBox = "rounded-lg bg-pastel-pink px-4 py-3 text-sm text-rose-deep";
