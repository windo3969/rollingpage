import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { OG_IMAGE } from "@/lib/site";

// 링크 미리보기용 공통 이미지. 빌드 시 한 번 생성되는 정적 파일이다.
// 방 제목·이름 같은 개인 정보는 넣지 않는다 (이미지는 카카오 서버 등에 캐시되어 오래 남는다).
export const dynamic = "force-static";

const HEADLINE = ["지금, 소중한 사람에게", "마음을 전해보세요."];
const TAGLINE = "검색에 노출되지 않는 안전한 생일 롤링페이퍼";

// 사이트와 같은 Pretendard (ImageResponse는 woff2를 못 읽으므로 패키지의 OTF 사용)
const fontPath = (weight: "Bold" | "Medium") =>
  join(process.cwd(), "node_modules/pretendard/dist/public/static", `Pretendard-${weight}.otf`);

function Heart({ size, filled = false }: { size: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        fill={filled ? "#e58a8e" : "none"}
        stroke="#e58a8e"
        strokeWidth={filled ? 0 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      />
    </svg>
  );
}

export async function GET() {
  const [bold, medium] = await Promise.all([readFile(fontPath("Bold")), readFile(fontPath("Medium"))]);

  // 오른쪽 장식: 시안의 파스텔 메시지 카드
  const cards = [
    { bg: "#fdecec", top: 70, left: 0, w: 200, h: 170 },
    { bg: "#fdf3dc", top: 110, left: 220, w: 170, h: 200 },
    { bg: "#e6eef9", top: 260, left: 20, w: 180, h: 210 },
    { bg: "#eeebf8", top: 330, left: 220, w: 170, h: 160 },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#faf7f4",
          color: "#33302e",
          fontFamily: "Pretendard",
        }}
      >
        {/* 왼쪽 문구 */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 90px", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 600 }}>
            <Heart size={38} />
            <span style={{ marginLeft: 10 }}>RollingPaper</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 44, fontSize: 60, fontWeight: 700, lineHeight: 1.3, letterSpacing: -1.5 }}>
            {HEADLINE.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 28, fontWeight: 500, color: "#8c847e" }}>{TAGLINE}</div>
        </div>

        {/* 오른쪽 카드 */}
        <div style={{ display: "flex", position: "relative", width: 440 }}>
          {cards.map((c) => (
            <div
              key={c.bg}
              style={{
                position: "absolute",
                top: c.top,
                left: c.left,
                width: c.w,
                height: c.h,
                background: c.bg,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                padding: 22,
              }}
            >
              <div style={{ display: "flex", width: 32, height: 32, borderRadius: 9999, background: "#ffffff" }} />
              <div style={{ display: "flex", marginTop: 18, width: "80%", height: 10, borderRadius: 9999, background: "rgba(51,48,46,0.12)" }} />
              <div style={{ display: "flex", marginTop: 10, width: "60%", height: 10, borderRadius: 9999, background: "rgba(51,48,46,0.12)" }} />
              <div style={{ display: "flex", marginTop: 16 }}>
                <Heart size={20} filled />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: OG_IMAGE.width,
      height: OG_IMAGE.height,
      fonts: [
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
        { name: "Pretendard", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
