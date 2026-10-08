# rollingpage

검색에 노출되지 않는 안전한 생일 롤링페이퍼 서비스.

기획·원칙은 [CLAUDE.md](CLAUDE.md) 참고.

## 로컬 실행

1. `npm install`
2. `.env.example`을 `.env.local`로 복사하고 Supabase 값 입력 (Supabase 대시보드 → Project Settings → API)
3. `npm run check:supabase` — 연결 확인
4. `npm run dev` → http://localhost:3000
