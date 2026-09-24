import type { MetadataRoute } from "next";
import { PUBLIC_PATHS } from "@/lib/seo";

// 허용 목록 방식: 공개 페이지만 Allow, 나머지(방/작성/결과/주최자/API 등 앞으로 추가될 경로 포함) 전부 Disallow.
// "$"는 정확히 그 경로만 허용한다는 뜻 (예: "/$"는 "/r/abc"를 허용하지 않음).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: PUBLIC_PATHS.map((path) => `${path}$`),
      disallow: "/",
    },
  };
}
