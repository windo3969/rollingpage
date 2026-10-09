// 사용할 수 있는 명령 안내: npm run help
// 새 스크립트를 package.json에 등록하면 여기에도 설명을 추가한다 (빠지면 맨 아래에 경고가 뜬다).
// README.md의 "명령 모음" 표도 함께 고친다.
import { readFileSync } from "node:fs";

const COMMANDS = [
  ["개발·배포", [
    ["dev", "개발 서버 실행 (http://localhost:3000)", "코드를 고치며 화면 확인할 때"],
    ["build", "배포용 빌드 (타입·오류 검사 포함)", "배포 전 확인"],
    ["start", "빌드한 결과 실행", "배포와 같은 상태로 확인할 때"],
    ["lint", "코드 규칙 검사", "커밋 전"],
  ]],
  ["점검", [
    ["check:supabase", "Supabase 키·연결 확인", "처음 세팅, 키를 바꿨을 때"],
    ["check:rls", "브라우저 키로 DB·사진 접근이 막혀 있는지 보안 점검", "SQL 실행 후, 배포 전"],
    ["check:seo", "검색엔진 차단(메타·헤더·robots.txt) 점검. 서버 실행 필요 (-- https://주소 로 실제 사이트도)", "배포 후"],
  ]],
  ["운영", [
    ["stats", "서비스 통계: 방·메시지·작성률·미리보기·PDF 신청 전환율·피드백·사진 누락 (숫자만)", "수시로"],
    ["feedback", "익명 피드백 최근 50개 (-- 200 이면 200개)", "수시로"],
    ["photobook:requests", "포토북 PDF 신청자 목록 (이름·번호·동의·롤링페이퍼 링크). 개인정보 주의", "연락할 때"],
    ["photobook:requests -- --purge", "포토북 신청자 정보 전부 파기", "이벤트 종료 후"],
  ]],
  ["테스트용", [
    ["seed:demo", "데모 방 만들기 (메시지 7개·사진 3장, 링크 출력)", "화면 확인할 때"],
    ["seed:demo -- --clean", "데모 방과 데모 클릭 기록 삭제", "확인 끝난 뒤"],
    ["make:sample-pdf", "샘플 포토북 페이지를 PDF로 다시 만들기. 서버 실행 필요", "샘플 디자인을 바꿨을 때"],
  ]],
  ["안내", [
    ["help", "이 목록 보기", "명령이 기억나지 않을 때"],
  ]],
];

// 터미널에서 한글은 두 칸을 차지하므로 표시 폭 기준으로 맞춘다
const width = (s) => [...s].reduce((w, ch) => w + (/[ᄀ-ᇿ㄰-㆏가-힣]/.test(ch) ? 2 : 1), 0);
const pad = (s, n) => s + " ".repeat(Math.max(1, n - width(s)));

console.log("\nrollingpage 명령 모음  (npm run <명령>)\n");
for (const [group, rows] of COMMANDS) {
  console.log(`■ ${group}`);
  for (const [name, what, when] of rows) {
    console.log(`  ${pad(name, 32)}${what}`);
    console.log(`  ${pad("", 32)}└ ${when}`);
  }
  console.log("");
}

// package.json에 있는데 설명이 없는 스크립트 경고
const registered = Object.keys(JSON.parse(readFileSync("package.json", "utf8")).scripts);
const documented = new Set(COMMANDS.flatMap(([, rows]) => rows.map(([name]) => name.split(" ")[0])));
const missing = registered.filter((name) => !documented.has(name));
if (missing.length) console.log(`⚠ 설명이 없는 스크립트: ${missing.join(", ")} → scripts/help.mjs에 추가하세요\n`);
