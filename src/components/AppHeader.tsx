import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="font-script text-2xl font-semibold text-ink">
      Rolling Paper<span className="ml-0.5 align-top text-xs text-rose">♥</span>
    </Link>
  );
}

// MVP는 로그인이 없으므로 시안의 로그인/메뉴는 넣지 않는다.
export function AppHeader() {
  return (
    <header className="mx-auto flex w-full max-w-md items-center px-5 pt-5">
      <Logo />
    </header>
  );
}
