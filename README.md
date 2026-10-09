# rollingpage

검색에 노출되지 않는 안전한 생일 롤링페이퍼 서비스.

기획·원칙은 [CLAUDE.md](CLAUDE.md) 참고.

## 로컬 실행

1. `npm install`
2. `.env.example`을 `.env.local`로 복사하고 Supabase 값 입력 (Supabase 대시보드 → Project Settings → API)
3. `npm run check:supabase` — 연결 확인
4. `npm run dev` → http://localhost:3000

## 명령 모음

터미널에서 `npm run help`로도 볼 수 있다. 새 스크립트를 추가하면 `package.json`, `scripts/help.mjs`, 이 표를 함께 고친다.

| 명령 | 하는 일 | 언제 |
|---|---|---|
| **개발·배포** | | |
| `npm run dev` | 개발 서버 실행 (http://localhost:3000) | 코드를 고치며 화면 확인할 때 |
| `npm run build` | 배포용 빌드 (타입·오류 검사 포함) | 배포 전 확인 |
| `npm run start` | 빌드한 결과 실행 | 배포와 같은 상태로 확인할 때 |
| `npm run lint` | 코드 규칙 검사 | 커밋 전 |
| **점검** | | |
| `npm run check:supabase` | Supabase 키·연결 확인 | 처음 세팅, 키를 바꿨을 때 |
| `npm run check:rls` | 브라우저 키로 DB·사진 접근이 막혀 있는지 보안 점검 | SQL 실행 후, 배포 전 |
| `npm run check:seo` | 검색엔진 차단(메타·헤더·robots.txt) 점검. 서버 실행 필요 (`-- https://주소`로 실제 사이트도) | 배포 후 |
| **운영** | | |
| `npm run stats` | 서비스 통계: 방·메시지·작성률·미리보기·PDF 신청 전환율·피드백·사진 누락 (숫자만) | 수시로 |
| `npm run feedback` | 익명 피드백 최근 50개 (`-- 200`이면 200개) | 수시로 |
| `npm run photobook:requests` | 포토북 PDF 신청자 목록 (이름·번호·동의·롤링페이퍼 링크). **개인정보 주의** | 연락할 때 |
| `npm run photobook:requests -- --purge` | 포토북 신청자 정보 전부 파기 | **이벤트 종료 후** |
| **테스트용** | | |
| `npm run seed:demo` | 데모 방 만들기 (메시지 7개·사진 3장, 링크 출력) | 화면 확인할 때 |
| `npm run seed:demo -- --clean` | 데모 방과 데모 클릭 기록 삭제 | 확인 끝난 뒤 |
| `npm run make:sample-pdf` | 샘플 포토북 페이지를 PDF로 다시 만들기. 서버 실행 필요 | 샘플 디자인을 바꿨을 때 |
| **안내** | | |
| `npm run help` | 이 목록 보기 | 명령이 기억나지 않을 때 |
