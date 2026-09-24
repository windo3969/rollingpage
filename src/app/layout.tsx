import type { Metadata } from "next";
import { Dancing_Script, Gaegu } from "next/font/google";
// 본문 폰트: Pretendard 동적 서브셋 (페이지에 쓰인 글자 범위만 내려받음, 자체 호스팅)
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { noIndexRobots } from "@/lib/seo";
import { ogMetadata } from "@/lib/og";
import { siteUrl } from "@/lib/site";

// 한글 손글씨 (제목, 메시지 카드)
const gaegu = Gaegu({
  variable: "--font-gaegu",
  weight: ["400", "700"],
  preload: false, // 한글 폰트는 용량이 커서 미리 불러오지 않는다
});

// 영문 스크립트 (로고, 장식)
const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  // 링크 미리보기(카카오톡 등) 기본값. 방/결과 페이지는 page에서 제목·설명을 덮어쓴다.
  ...ogMetadata("롤링페이퍼", "검색에 노출되지 않는 안전한 생일 롤링페이퍼"),
  // 모든 페이지 기본값: 검색엔진 차단. 공개 페이지만 page에서 indexableRobots로 덮어쓴다.
  robots: noIndexRobots,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${gaegu.variable} ${dancingScript.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
