// 포토북 샘플 PDF 만들기: 서버를 띄운 상태에서 npm run make:sample-pdf [URL]
// /photobook/sample 페이지를 Edge/Chrome 헤드리스로 인쇄(A5, print.css)해서 public/ 아래에 저장한다.
// 샘플 내용·디자인을 바꾸면 다시 실행해서 PDF도 갱신한다.
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const url = process.argv[2] ?? "http://localhost:3000/photobook/sample";
const out = resolve("public/photobook-sample/rollingpaper-photobook-sample.pdf");

const candidates = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];
const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error("✗ Edge 또는 Chrome을 찾지 못했습니다.");
  process.exit(1);
}

execFileSync(browser, [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=15000", // 웹폰트·이미지 로딩 대기
  `--print-to-pdf=${out}`,
  url,
]);

console.log(`✓ ${out} (${Math.round(statSync(out).size / 1024)}KB)`);
