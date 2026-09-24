import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { buttonPrimary } from "@/components/ui";
import { indexableRobots } from "@/lib/seo";

// 랜딩은 마케팅용 공개 페이지이므로 검색 노출을 허용한다 (seo.ts의 PUBLIC_PATHS와 함께 관리).
export const metadata: Metadata = {
  robots: indexableRobots,
};

const STEPS = [
  { icon: "📝", bg: "bg-pastel-pink", title: "방 생성하기", body: "제목, 대상자 이름, 마감일, 비밀번호(선택)로 방을 만들어요." },
  { icon: "🔗", bg: "bg-pastel-yellow", title: "링크 공유하기", body: "생성된 링크를 친구들에게 공유해요." },
  { icon: "✏️", bg: "bg-pastel-mint", title: "메시지 작성하기", body: "링크만으로 간단하게 텍스트와 사진 1장을 작성할 수 있어요." },
  { icon: "🎁", bg: "bg-pastel-sky", title: "결과물 확인하기", body: "모든 메시지가 모이면 예쁜 롤링페이퍼로 완성돼요!" },
];

const SAFETY = [
  { icon: "🚫", title: "검색엔진 차단", body: "검색에 노출되지 않아요" },
  { icon: "🔒", title: "랜덤 URL", body: "주소를 추측할 수 없어요" },
  { icon: "🖼️", title: "사진 비공개 저장", body: "안전하게 보관돼요" },
];

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-5 pb-16">
        <section className="pt-14 pb-12">
          <h1 className="font-hand text-4xl leading-snug font-bold">
            마음이 모여
            <br />
            특별한 한 장이 되는 곳 <span className="text-rose">♡</span>
          </h1>
          <p className="mt-5 leading-relaxed text-ink-muted">
            검색에 절대 노출되지 않는,
            <br />
            관리하기 쉬운, 소장할 수 있는
            <br />
            생일 롤링페이퍼
          </p>
          <Link href="/new" className={`${buttonPrimary} mt-8`}>
            지금 방 만들기 →
          </Link>
        </section>

        <section className="py-10">
          <p className="text-center font-script text-lg text-ink-muted">– How it works –</p>
          <h2 className="mt-1 text-center font-hand text-3xl font-bold">이렇게 진행돼요</h2>
          <ol className="mt-8 grid grid-cols-2 gap-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="rounded-2xl bg-white p-4 text-center">
                <div className={`mx-auto flex size-14 items-center justify-center rounded-full text-2xl ${step.bg}`}>
                  {step.icon}
                </div>
                <p className="mt-3 text-sm font-semibold">
                  {i + 1}. {step.title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-4 rounded-3xl bg-pastel-sky/60 px-5 py-8">
          <h2 className="text-center font-hand text-2xl font-bold">안전하게, 오직 너만을 위한 공간</h2>
          <ul className="mt-6 grid grid-cols-3 gap-2 text-center">
            {SAFETY.map((item) => (
              <li key={item.title}>
                <div className="text-2xl">{item.icon}</div>
                <p className="mt-2 text-xs font-semibold">{item.title}</p>
                <p className="mt-1 text-[11px] text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
