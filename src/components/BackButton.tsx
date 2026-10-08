"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ChevronRightIcon } from "./icons";

// 앱 안의 버튼으로 들어온 경우(주소에 ?from= 표시)에만 이전 페이지로 돌아가고,
// 링크로 바로 들어온 경우에는 fallback(기본: 첫 화면)으로 보낸다.
// history.length만으로는 새 탭의 빈 페이지와 구분할 수 없고, 결과·주최자 페이지는 Referer를 보내지 않으므로 표시를 쓴다.
export function BackButton({
  fallback = "/",
  className = "",
  children = "돌아가기",
}: {
  fallback?: string;
  className?: string;
  children?: ReactNode;
}) {
  const router = useRouter();

  function back() {
    const cameFromApp = new URLSearchParams(window.location.search).has("from");
    if (cameFromApp && window.history.length > 1) router.back();
    else router.push(fallback);
  }

  return (
    <button type="button" onClick={back} className={`inline-flex items-center gap-1 ${className}`}>
      <ChevronRightIcon size={20} className="rotate-180" />
      {children}
    </button>
  );
}
