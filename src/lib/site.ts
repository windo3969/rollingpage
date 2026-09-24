// 사이트의 절대 URL (OG 태그 등 절대 경로가 필요한 곳에 사용)
// 우선순위: 직접 지정 > Vercel 프로덕션 도메인 > 로컬 개발
export function siteUrl(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) return new URL(process.env.NEXT_PUBLIC_SITE_URL);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  return new URL("http://localhost:3000");
}

// OG·카카오 공유 미리보기 이미지 (카카오 권장 비율 2:1)
export const OG_IMAGE = { path: "/og.png", width: 1200, height: 600 } as const;
