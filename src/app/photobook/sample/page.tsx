import type { Metadata } from "next";
import { Gaegu } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import { buttonPrimary } from "@/components/ui";
import { ClosingPage, CoverPage, MessagePage, ThanksPage } from "./PhotobookPages";
import { PhotobookViewer } from "./PhotobookViewer";
import { SAMPLE, SAMPLE_PAGES, SAMPLE_PDF_PATH } from "./sampleData";
import "./print.css";

export const metadata: Metadata = {
  title: "포토북 미리보기",
  description: "친구들의 메시지와 사진으로 만든 생일 포토북 샘플",
};

// 포토북 전용 손글씨 (사이트 나머지는 Pretendard). 이 페이지에서만 불러온다.
const bookHand = Gaegu({ weight: ["400", "700"], variable: "--font-book-hand", preload: false });

// 목차(2쪽) 다음부터 메시지 페이지 번호가 매겨진다
const FIRST_MESSAGE_PAGE = 3;

export default function PhotobookSamplePage() {
  const thanks = SAMPLE_PAGES.flatMap((page, i) => {
    const pageNumber = FIRST_MESSAGE_PAGE + i;
    return page.layout === "twoNotes"
      ? page.notes.map((n) => ({ name: n.author, page: pageNumber }))
      : [{ name: page.author, page: pageNumber }];
  });

  return (
    <div className={`${bookHand.variable} flex flex-1 flex-col`}>
      <div className="print:hidden">
        <AppHeader />
      </div>

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
          <a href={SAMPLE_PDF_PATH} download className={`${buttonPrimary} w-full`}>
            샘플 PDF 다운로드 (무료)
          </a>
          <p className="mt-3 text-center text-xs text-ink-muted">A5 크기 · 인쇄해서 바로 쓸 수 있어요</p>
        </div>
      </main>
    </div>
  );
}
