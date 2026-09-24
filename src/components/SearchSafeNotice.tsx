// CLAUDE.md 보안 원칙 7: 신뢰 표시
export function SearchSafeNotice() {
  return (
    <p className="flex items-center justify-center gap-1.5 text-xs text-ink-muted">
      <span aria-hidden>🔒</span>
      이 페이지는 검색엔진에 노출되지 않습니다
    </p>
  );
}
