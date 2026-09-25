"use client";

import { useState } from "react";
import { recordPdfInterest, type PdfInterestSource } from "@/lib/events";
import { BookIcon } from "./icons";

// 수요 검증용 버튼 (CLAUDE.md Phase 1-8). 누르면 클릭만 기록하고 "준비 중" 안내를 보여준다.
export function PdfInterestButton({ source, recordKey }: { source: PdfInterestSource; recordKey: string }) {
  const [clicked, setClicked] = useState(false);

  function onClick() {
    if (clicked) return; // 한 번 본 화면에서는 한 번만 기록
    setClicked(true);
    recordPdfInterest(source, recordKey).catch(() => {}); // 기록 실패는 사용자 경험에 영향 주지 않음
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-full border border-rose bg-white px-5 py-3 text-sm font-semibold text-rose"
      >
        <BookIcon size={18} />
        포토북 PDF 받기
        <span className="rounded-full bg-pastel-pink px-2 py-0.5 text-xs font-medium">준비 중</span>
      </button>
      {clicked && (
        <p role="status" className="text-center text-sm text-ink-muted">
          사진과 메시지를 모은 포토북 PDF를 준비하고 있어요.
          <br />
          관심 가져주셔서 고마워요 ♡
        </p>
      )}
    </div>
  );
}
