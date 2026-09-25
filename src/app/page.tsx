import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentType } from "react";
import { AppHeader } from "@/components/AppHeader";
import {
  GiftIcon,
  ImageIcon,
  LinkIcon,
  PencilIcon,
  PlusIcon,
  SearchOffIcon,
  ShuffleIcon,
} from "@/components/icons";
import { buttonPrimary } from "@/components/ui";
import { indexableRobots } from "@/lib/seo";

// 랜딩은 마케팅용 공개 페이지이므로 검색 노출을 허용한다 (seo.ts의 PUBLIC_PATHS와 함께 관리).
export const metadata: Metadata = {
  robots: indexableRobots,
};

type Item = { Icon: ComponentType<{ size?: number }>; tone: string; title: string; body: string };

const STEPS: Item[] = [
  { Icon: PlusIcon, tone: "bg-pastel-pink text-rose", title: "방 생성하기", body: "제목, 대상자 이름, 마감일, 비밀번호(선택)로 방을 만들어요." },
  { Icon: LinkIcon, tone: "bg-pastel-sky text-[#6b8fc7]", title: "링크 공유하기", body: "생성된 링크를 친구들에게 공유해요. (카카오톡 공유 최적화)" },
  { Icon: PencilIcon, tone: "bg-pastel-mint text-mint", title: "메시지 작성하기", body: "링크만으로 간단하게 텍스트와 사진 1장을 작성할 수 있어요." },
  { Icon: GiftIcon, tone: "bg-pastel-lavender text-[#8b7fc9]", title: "결과물 확인하기", body: "모든 메시지가 모이면 예쁜 롤링페이퍼로 완성돼요!" },
];

const SAFETY: Item[] = [
  { Icon: SearchOffIcon, tone: "", title: "검색엔진 차단", body: "검색에 노출되지 않아요" },
  { Icon: ShuffleIcon, tone: "", title: "랜덤 URL", body: "주소를 추측할 수 없어요" },
  { Icon: ImageIcon, tone: "", title: "사진 비공개 저장", body: "안전하게 보관돼요" },
];

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-5 pb-16">
        <section className="pt-16 pb-14">
          <h1 className="text-[32px] leading-[1.35] font-bold tracking-tight">
            지금,
            <br />
            소중한 사람에게
            <br />
            마음을 전해보세요.
          </h1>
          <p className="mt-5 leading-relaxed text-ink-muted">
            검색에 절대 노출되지 않는,
            <br />
            관리하기 쉬운, 소장할 수 있는
            <br />
            생일 롤링페이퍼 웹 서비스
          </p>
          <Link href="/new" className={`${buttonPrimary} mt-8`}>
            지금 방 만들기 →
          </Link>
        </section>

        <section className="py-10">
          <p className="text-center text-sm text-ink-muted">How it works</p>
          <h2 className="mt-1 text-center text-2xl font-bold tracking-tight">이렇게 진행돼요</h2>
          <p className="mt-2 text-center text-sm text-ink-muted">간단한 4단계로, 세상에 하나뿐인 롤링페이퍼를 만들어보세요.</p>
          <ol className="mt-8 grid grid-cols-2 gap-3">
            {STEPS.map(({ Icon, tone, title, body }, i) => (
              <li key={title} className="rounded-2xl border border-line bg-white px-4 py-6 text-center">
                <div className={`mx-auto flex size-14 items-center justify-center rounded-full ${tone}`}>
                  <Icon size={26} />
                </div>
                <p className="mt-4 text-sm font-semibold">
                  {i + 1}. {title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-4 rounded-2xl bg-pastel-lavender/70 px-5 py-8">
          <h2 className="text-center text-lg font-bold tracking-tight">안전하게, 오직 너만을 위한 공간</h2>
          <ul className="mt-6 grid grid-cols-3 gap-2 text-center">
            {SAFETY.map(({ Icon, title, body }) => (
              <li key={title} className="flex flex-col items-center">
                <Icon size={26} />
                <p className="mt-2 text-xs font-semibold">{title}</p>
                <p className="mt-1 text-[11px] text-ink-muted">{body}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
