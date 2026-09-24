// 검색엔진 차단 확인: 서버를 띄운 상태에서 npm run check:seo [BASE_URL]
// 기본 BASE_URL은 http://localhost:3000. 배포 후에는 실제 도메인으로 실행한다.
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

// 차단되어야 하는 경로 예시 (존재하지 않는 경로여도 404 페이지까지 차단되어야 한다)
const PRIVATE_PATHS = ["/new", "/host/checkseo0000000000000000000000000", "/r/checkseo0000000000", "/r/checkseo0000000000/write", "/host/checkseo", "/api/checkseo"];

let ok = true;
const report = (pass, msg) => {
  console.log(`${pass ? "✓" : "✗"} ${msg}`);
  ok &&= pass;
};

// robots 메타 태그가 여러 개일 수 있다 (예: Next.js 404의 기본 noindex). 검색엔진처럼 모두 합쳐서 본다.
const robotsMeta = (html) =>
  [...html.matchAll(/<meta[^>]*name="robots"[^>]*>/g)]
    .map((m) => m[0].match(/content="([^"]*)"/)?.[1])
    .filter(Boolean)
    .join(", ") || undefined;

// 1) robots.txt
const robots = await (await fetch(`${base}/robots.txt`)).text();
report(/Disallow: \/\s*$/m.test(robots), "robots.txt: 기본 전체 Disallow");
report(/Allow: \/\$/m.test(robots), "robots.txt: 랜딩(/)만 Allow");

// 2) 랜딩: 공개
{
  const res = await fetch(`${base}/`);
  const html = await res.text();
  report(!res.headers.get("x-robots-tag"), `/ : X-Robots-Tag 없음 (${res.headers.get("x-robots-tag") ?? "없음"})`);
  report(robotsMeta(html) === "index, follow", `/ : meta robots = ${robotsMeta(html)}`);
}

// 3) 비공개 경로: 헤더 + 메타 모두 차단
for (const path of PRIVATE_PATHS) {
  const res = await fetch(`${base}${path}`);
  const html = await res.text();
  const header = res.headers.get("x-robots-tag");
  report(header === "noindex, nofollow", `${path} : X-Robots-Tag = ${header}`);
  if (res.headers.get("content-type")?.includes("text/html")) {
    const meta = robotsMeta(html);
    report(meta?.includes("noindex") && meta?.includes("nofollow"), `${path} : meta robots = ${meta}`);
  }
}

process.exit(ok ? 0 : 1);
