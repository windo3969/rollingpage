"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronRightIcon } from "@/components/icons";

// 포토북을 한 장씩 옆으로 넘겨 보는 뷰어 (휴대폰은 스와이프, PC는 화살표 버튼).
// 인쇄(PDF)할 때는 넘김 없이 모든 페이지를 한 장씩 차례로 찍는다.
export function PhotobookViewer({ children }: { children: ReactNode }) {
  const pages = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  // 가운데에 보이는 페이지를 현재 페이지로
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { root: track, threshold: 0.6 },
    );
    track.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function go(index: number) {
    const target = trackRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    target?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  const arrow =
    "absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow md:flex disabled:opacity-0 print:hidden";

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[9vw] pb-2 [scrollbar-width:none] md:px-[calc(50%-200px)] print:block print:overflow-visible print:p-0"
      >
        {pages.map((page, i) => (
          <div
            key={i}
            data-index={i}
            className="w-[82vw] max-w-[400px] shrink-0 snap-center overflow-hidden rounded-sm shadow-[0_4px_20px_rgba(61,54,50,0.12)] print:w-auto print:max-w-none print:rounded-none print:shadow-none"
          >
            {page}
          </div>
        ))}
      </div>

      <button type="button" onClick={() => go(current - 1)} disabled={current === 0} aria-label="이전 페이지" className={`${arrow} left-4 rotate-180`}>
        <ChevronRightIcon size={20} />
      </button>
      <button
        type="button"
        onClick={() => go(current + 1)}
        disabled={current === pages.length - 1}
        aria-label="다음 페이지"
        className={`${arrow} right-4`}
      >
        <ChevronRightIcon size={20} />
      </button>

      <p className="mt-3 text-center text-sm text-ink-muted print:hidden" aria-live="polite">
        {current + 1} / {pages.length}
      </p>
    </div>
  );
}
