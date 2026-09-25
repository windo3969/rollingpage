"use client";

import { useState } from "react";
import { LightbulbIcon, RefreshIcon } from "@/components/icons";
import { hintsFor, RELATIONSHIPS, type Relationship } from "@/lib/hints";

// 작성 페이지 상단 글감 힌트. 관계를 고르면 그에 맞는 질문을 보여준다 (저장하지 않음).
export function HintBox() {
  const [relationship, setRelationship] = useState<Relationship>("전체");
  const [index, setIndex] = useState(0); // 첫 질문은 고정 → 서버/클라이언트 렌더 결과가 같다

  const hints = hintsFor(relationship);
  const hint = hints[index % hints.length];

  function choose(next: Relationship) {
    setRelationship(next);
    setIndex(0);
  }

  function nextHint() {
    // 지금과 다른 질문을 무작위로
    const offset = 1 + Math.floor(Math.random() * (hints.length - 1));
    setIndex((i) => (i + offset) % hints.length);
  }

  return (
    <section className="rounded-2xl border border-line bg-white p-4" aria-label="글감 힌트">
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <LightbulbIcon size={18} className="text-[#e0b04a]" />
        글감 힌트
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label="받는 사람과의 관계">
        {RELATIONSHIPS.map((r) => (
          <button
            key={r}
            type="button"
            role="radio"
            aria-checked={relationship === r}
            onClick={() => choose(r)}
            className={`rounded-full px-3 py-1 text-xs ${
              relationship === r ? "bg-ink font-medium text-white" : "bg-cream text-ink-muted"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl bg-cream px-4 py-3">
        <p className="flex-1 text-sm leading-relaxed" aria-live="polite">
          “{hint}”
        </p>
        <button
          type="button"
          onClick={nextHint}
          aria-label="다른 질문 보기"
          className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs text-ink-muted hover:bg-line"
        >
          <RefreshIcon size={14} />
          다른 질문
        </button>
      </div>
    </section>
  );
}
