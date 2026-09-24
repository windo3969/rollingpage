import type { Metadata } from "next";
import { indexableRobots } from "@/lib/seo";

// 랜딩은 마케팅용 공개 페이지이므로 검색 노출을 허용한다 (seo.ts의 PUBLIC_PATHS와 함께 관리).
export const metadata: Metadata = {
  robots: indexableRobots,
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-bold">롤링페이퍼</h1>
      <p className="mt-2 text-sm text-zinc-500">준비 중입니다.</p>
    </main>
  );
}
