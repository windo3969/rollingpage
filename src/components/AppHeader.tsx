import Link from "next/link";
import { HeartIcon } from "./icons";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-1.5 text-lg font-semibold tracking-tight text-ink">
      <HeartIcon size={22} className="text-rose" />
      RollingPaper
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
