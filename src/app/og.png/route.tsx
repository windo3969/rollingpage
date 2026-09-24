import { ImageResponse } from "next/og";
import { OG_IMAGE } from "@/lib/site";

// 링크 미리보기용 공통 이미지. 빌드 시 한 번 생성되는 정적 파일이다.
// 방 제목·이름 같은 개인 정보는 넣지 않는다 (이미지는 카카오 서버 등에 캐시되어 오래 남는다).
export const dynamic = "force-static";

const HEADLINE = ["마음이 모여", "특별한 한 장이 되는 곳"];
const TAGLINE = "검색에 노출되지 않는 안전한 생일 롤링페이퍼";
const LOGO = "Rolling Paper";

function Heart({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        fill="#e58a8e"
        d="M12 21s-7.5-4.6-10-9.3C.4 8.6 2.1 4.5 6 4.5c2.3 0 3.6 1.3 6 3.8 2.4-2.5 3.7-3.8 6-3.8 3.9 0 5.6 4.1 4 7.2C19.5 16.4 12 21 12 21z"
      />
    </svg>
  );
}

// Google Fonts에서 필요한 글자만 담은 TTF를 받아온다 (ImageResponse는 woff2 미지원)
async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(cssUrl)).text();
  const fontUrl = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!fontUrl) throw new Error(`OG 이미지 폰트를 불러오지 못했습니다: ${family}`);
  return (await fetch(fontUrl)).arrayBuffer();
}

export async function GET() {
  const [gaegu, dancing] = await Promise.all([
    loadGoogleFont("Gaegu", 700, HEADLINE.join("") + TAGLINE),
    loadGoogleFont("Dancing+Script", 600, LOGO),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fbf6f0",
          color: "#3d3632",
          position: "relative",
        }}
      >
        {/* 파스텔 장식 원 */}
        <div style={{ position: "absolute", top: -80, right: 120, width: 260, height: 260, borderRadius: 9999, background: "#fbe3e3" }} />
        <div style={{ position: "absolute", bottom: -100, right: -40, width: 320, height: 320, borderRadius: 9999, background: "#dde9f7" }} />
        <div style={{ position: "absolute", bottom: 60, left: -60, width: 160, height: 160, borderRadius: 9999, background: "#fcebc7" }} />

        {/* 왼쪽 문구 */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", flex: 1 }}>
          <div style={{ display: "flex", fontFamily: "Dancing Script", fontSize: 44 }}>
            {LOGO}
            <div style={{ display: "flex", marginLeft: 8, marginTop: 4 }}>
              <Heart size={24} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 36, fontFamily: "Gaegu", fontSize: 64, lineHeight: 1.25 }}>
            {HEADLINE.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: 32, fontFamily: "Gaegu", fontSize: 32, color: "#8c817a" }}>{TAGLINE}</div>
        </div>

        {/* 오른쪽 카드 */}
        <div style={{ display: "flex", alignItems: "center", paddingRight: 110 }}>
          <div
            style={{
              display: "flex",
              position: "relative",
              width: 300,
              height: 360,
              background: "#fdf3ea",
              borderRadius: 8,
              boxShadow: "0 12px 30px rgba(61,54,50,0.15)",
              transform: "rotate(6deg)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "absolute", top: -14, left: 110, width: 90, height: 28, background: "#f4c2c2", opacity: 0.85, transform: "rotate(-4deg)" }} />
            <Heart size={72} />
          </div>
        </div>
      </div>
    ),
    {
      width: OG_IMAGE.width,
      height: OG_IMAGE.height,
      fonts: [
        { name: "Gaegu", data: gaegu, weight: 700, style: "normal" },
        { name: "Dancing Script", data: dancing, weight: 600, style: "normal" },
      ],
    },
  );
}
