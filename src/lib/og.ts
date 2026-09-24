import type { Metadata } from "next";
import { OG_IMAGE } from "./site";

// 페이지별 링크 미리보기. page의 openGraph는 layout 값을 통째로 덮어쓰므로 이미지까지 다시 지정한다.
export function ogMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "Rolling Paper",
      locale: "ko_KR",
      title,
      description,
      images: [{ url: OG_IMAGE.path, width: OG_IMAGE.width, height: OG_IMAGE.height }],
    },
  };
}
