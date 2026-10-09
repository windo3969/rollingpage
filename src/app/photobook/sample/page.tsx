import type { Metadata } from "next";
import { Gaegu } from "next/font/google";
import { Logo } from "@/components/AppHeader";
import { BackButton } from "@/components/BackButton";
import { buttonSecondary } from "@/components/ui";
import { isPhotobookSource, PHOTOBOOK_EVENT, type PhotobookSource } from "@/lib/photobook";
import { countPhotobookRequests } from "@/lib/photobookRequests";
import { ClosingPage, CoverPage, MessagePage, ThanksPage } from "./PhotobookPages";
import { PhotobookViewer } from "./PhotobookViewer";
import { RequestForm } from "./RequestForm";
import { SAMPLE, SAMPLE_PAGES } from "./sampleData";
import "./print.css";

export const metadata: Metadata = {
  title: "포토북 미리보기",
  description: "친구들의 메시지와 사진으로 만든 생일 포토북 샘플",
  // 주소에 결과 ID(r)가 들어갈 수 있으므로 외부로 나가는 요청에 Referer를 싣지 않는다
  referrer: "no-referrer",
};

const RESULT_ID_PATTERN = /^[a-f0-9]{32}$/;

// 포토북 전용 손글씨 (사이트 나머지는 Pretendard). 이 페이지에서만 불러온다.
const bookHand = Gaegu({ weight: ["400", "700"], variable: "--font-book-hand", preload: false });

// 목차(2쪽) 다음부터 메시지 페이지 번호가 매겨진다
const FIRST_MESSAGE_PAGE = 3;

export default async function PhotobookSamplePage(props: PageProps<"/photobook/sample">) {
  // 어디서 미리보기를 열었는지 (전환율을 결과/주최자 페이지별로 보기 위해)
  const { from, r } = await props.searchParams;
  const source: PhotobookSource = typeof from === "string" && isPhotobookSource(from) ? from : "direct";
  // 어느 롤링페이퍼로 PDF를 만들지 (형식이 맞을 때만 넘긴다. 실제 방 확인은 신청할 때 서버에서)
  const resultId = typeof r === "string" && RESULT_ID_PATTERN.test(r) ? r : null;
  const remaining = Math.max(0, PHOTOBOOK_EVENT.freeQuota - (await countPhotobookRequests()));

  const thanks = SAMPLE_PAGES.flatMap((page, i) => {
    const pageNumber = FIRST_MESSAGE_PAGE + i;
    return page.layout === "twoNotes"
      ? page.notes.map((n) => ({ name: n.author, page: pageNumber }))
      : [{ name: page.author, page: pageNumber }];
  });

  return (
    <div className={`${bookHand.variable} flex flex-1 flex-col`}>
      {/* 결과·주최자 페이지에서 넘어오므로 돌아갈 수 있게 뒤로가기를 둔다 */}
      <header className="mx-auto flex w-full max-w-md items-center justify-between px-5 pt-5 print:hidden">
        <BackButton className="-ml-1.5 rounded-full py-1 pr-3 pl-1 text-sm font-medium text-ink active:bg-line" />
        <Logo />
      </header>

      <main className="w-full flex-1 py-8 print:p-0">
        <header className="mx-auto max-w-md px-5 print:hidden">
          <p className="text-xs tracking-[0.2em] text-ink-muted">PHOTOBOOK SAMPLE</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">소중한 마음이 한 권의 책으로</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            친구들이 남긴 메시지와 사진이 이렇게 포토북으로 만들어져요.
            <br />옆으로 넘겨서 샘플을 둘러보세요.
          </p>
        </header>

        <div className="mt-6 print:mt-0">
          <PhotobookViewer>
            <CoverPage recipient={SAMPLE.recipient} {...SAMPLE.cover} />
            <ThanksPage entries={thanks} number={2} />
            {SAMPLE_PAGES.map((page, i) => (
              <MessagePage key={i} page={page} number={FIRST_MESSAGE_PAGE + i} />
            ))}
            <ClosingPage text={SAMPLE.closing} background={SAMPLE.closingBackground} />
          </PhotobookViewer>
        </div>

        <div className="mx-auto mt-8 max-w-md px-5 print:hidden">
          <RequestForm source={source} resultId={resultId} remaining={remaining} />
          <BackButton className={`${buttonSecondary} mt-6 w-full`}>롤링페이퍼로 돌아가기</BackButton>
        </div>
      </main>
    </div>
  );
}
