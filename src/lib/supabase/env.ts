function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`환경 변수 ${name}가 설정되지 않았습니다. .env.local을 확인하세요.`);
  }
  return value;
}

// NEXT_PUBLIC_ 변수는 빌드 시 인라인되므로 process.env.X 형태로 직접 참조해야 한다.
export const supabaseUrl = () =>
  required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const supabaseAnonKey = () =>
  required("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
