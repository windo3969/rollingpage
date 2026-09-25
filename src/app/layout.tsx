import type { Metadata } from "next";
// 글꼴: Pretendard 하나만 사용. 동적 서브셋이라 페이지에 쓰인 글자 범위만 내려받는다 (자체 호스팅)
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { noIndexRobots } from "@/lib/seo";
import { ogMetadata } from "@/lib/og";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  // 링크 미리보기(카카오톡 등) 기본값. 방/결과 페이지는 page에서 제목·설명을 덮어쓴다.
  ...ogMetadata("롤링페이퍼", "검색에 노출되지 않는 안전한 생일 롤링페이퍼"),
  // 모든 페이지 기본값: 검색엔진 차단. 공개 페이지만 page에서 indexableRobots로 덮어쓴다.
  robots: noIndexRobots,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
