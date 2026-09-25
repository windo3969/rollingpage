"use client";

import { useEffect, useState } from "react";

// 카드 속 사진: 원본 비율로 보여주고, 누르면 화면 전체로 크게 본다.
// signed URL은 매번 바뀌므로 next/image 최적화 캐시 대신 일반 img를 쓴다.
export function ZoomablePhoto({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden"; // 확대 중에는 뒤 페이지가 스크롤되지 않게
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="사진 크게 보기" className="block w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block h-auto w-full" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="사진 크게 보기"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          {/* 작은 사진도 화면에 맞게 키우되 비율은 유지 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="h-full w-full object-contain" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="닫기"
            className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
