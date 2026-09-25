// 포토북 페이지들. 한 페이지 = A5 세로 비율(148:210).
// 페이지 안의 크기는 모두 cqw(페이지 폭 기준 %)라서 휴대폰 화면과 A5 인쇄(PDF)에서 같은 모양으로 보인다.
import type { ReactNode } from "react";
import type { SamplePage } from "./sampleData";

const hand = "font-[family-name:var(--font-book-hand)]";

export function Page({ children, number, className = "" }: { children: ReactNode; number?: number; className?: string }) {
  return (
    <section
      className={`@container relative aspect-[148/210] w-full overflow-hidden bg-[#fbf8f3] text-ink ${className} print:w-[148mm] print:break-after-page`}
    >
      {children}
      {number !== undefined && (
        <p className="absolute bottom-[4cqw] left-0 w-full text-center text-[2.4cqw] tracking-[0.2em] text-ink-muted">
          {String(number).padStart(2, "0")}
        </p>
      )}
    </section>
  );
}

function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
      <path d="M12 20.5s-7.5-4.6-9.3-9.4C1.4 7.6 3.6 4.5 6.9 4.5c2.2 0 3.6 1.3 5.1 3.2 1.5-1.9 2.9-3.2 5.1-3.2 3.3 0 5.5 3.1 4.2 6.6-1.8 4.8-9.3 9.4-9.3 9.4z" />
    </svg>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2c.6 4.6 2.4 6.9 7 7.6-4.6.7-6.4 3-7 7.6-.6-4.6-2.4-6.9-7-7.6 4.6-.7 6.4-3 7-7.6z" />
    </svg>
  );
}

// 폴라로이드 사진 + 마스킹테이프
function Polaroid({ src, rotate, tape = "bg-[#f4c2c2]/80", className = "" }: { src: string; rotate: string; tape?: string; className?: string }) {
  return (
    <div className={`relative bg-white p-[2.2cqw] pb-[7cqw] shadow-[0_0.6cqw_2cqw_rgba(61,54,50,0.15)] ${rotate} ${className}`}>
      <span className={`absolute -top-[2cqw] left-1/2 h-[4.5cqw] w-[18cqw] -translate-x-1/2 -rotate-3 ${tape}`} aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element -- 정적 샘플 이미지, PDF 인쇄에도 그대로 쓰인다 */}
      <img src={src} alt="" className="block aspect-square w-full object-cover" />
    </div>
  );
}

function Signature({ name }: { name: string }) {
  return <p className={`${hand} mt-[4cqw] text-right text-[4.2cqw] text-ink-muted`}>- {name} -</p>;
}

function Handwriting({ text, size = "text-[6cqw]" }: { text: string; size?: string }) {
  return <p className={`${hand} ${size} leading-[1.45] whitespace-pre-line`}>{text}</p>;
}

// ─── 표지 ──────────────────────────────────────────────
export function CoverPage({ recipient, photo, line, from }: { recipient: string; photo: string; line: string; from: string }) {
  return (
    <Page>
      <div className="flex h-full flex-col items-center px-[12cqw] pt-[9cqw]">
        <p className="text-[2.4cqw] tracking-[0.45em] text-ink-muted">FOR YOU</p>
        <div className="relative mt-[6cqw] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" className="block aspect-[4/4.2] w-full object-cover" />
          <div className="absolute inset-0 flex flex-col items-center pt-[10cqw] text-[#3d4660]">
            <p className={`${hand} -rotate-6 text-[11cqw] leading-none`}>Happy</p>
            <p className={`${hand} -rotate-6 pl-[8cqw] text-[11cqw] leading-none`}>Birthday</p>
            <Heart className="mt-[3cqw] size-[6cqw]" />
          </div>
        </div>
        <p className={`${hand} mt-[7cqw] text-center text-[5cqw] leading-snug whitespace-pre-line`}>{line}</p>
        <Heart className="mt-[2cqw] size-[4cqw] text-rose" />
        <p className="mt-auto mb-[8cqw] text-[2.6cqw] tracking-[0.15em] text-ink-muted">
          {from} · to. {recipient}
        </p>
      </div>
    </Page>
  );
}

// ─── 목차 ──────────────────────────────────────────────
export function ThanksPage({ entries, number }: { entries: { name: string; page: number }[]; number: number }) {
  return (
    <Page number={number}>
      <div className="flex h-full flex-col px-[14cqw] pt-[14cqw]">
        <p className={`${hand} text-center text-[7cqw]`}>Special Thanks</p>
        <Heart className="mx-auto mt-[2cqw] size-[4cqw] text-rose" />
        <ul className="mt-[9cqw] flex flex-col gap-[3.2cqw] text-[3.4cqw]">
          {entries.map((e) => (
            <li key={e.name} className="flex items-baseline gap-[2cqw]">
              <span>{e.name}</span>
              <span className="flex-1 border-b border-dotted border-ink-muted/40" />
              <span className="text-ink-muted">{String(e.page).padStart(2, "0")}</span>
            </li>
          ))}
        </ul>
        <p className={`${hand} mt-auto mb-[14cqw] text-center text-[4.4cqw] text-ink-muted`}>
          소중한 마음을 모아 전해요
        </p>
      </div>
    </Page>
  );
}

// ─── 메시지 페이지 ─────────────────────────────────────
export function MessagePage({ page, number }: { page: SamplePage; number: number }) {
  switch (page.layout) {
    case "photoTop":
      return (
        <Page number={number}>
          <div className="flex h-full flex-col px-[13cqw] pt-[11cqw]">
            <Polaroid src={page.photo} rotate="-rotate-2" className="mx-auto w-[64cqw]" />
            <div className="mt-[6cqw]">
              <Handwriting text={page.text} size="text-[5.4cqw]" />
              <Signature name={page.author} />
            </div>
          </div>
        </Page>
      );
    case "textTop":
      return (
        <Page number={number}>
          <div className="flex h-full flex-col px-[13cqw] pt-[14cqw]">
            <Handwriting text={page.text} size="text-[5.8cqw]" />
            <Heart className="mt-[2cqw] size-[4cqw] text-rose" />
            <Polaroid src={page.photo} rotate="rotate-2" tape="bg-[#dde9f7]/90" className="mt-[7cqw] ml-auto w-[64cqw]" />
            <Signature name={page.author} />
          </div>
        </Page>
      );
    case "collage":
      return (
        <Page number={number}>
          <div className="relative h-full px-[10cqw] pt-[11cqw]">
            <Polaroid src={page.photos[0]} rotate="-rotate-3" className="w-[46cqw]" />
            <Polaroid src={page.photos[1]} rotate="rotate-3" tape="bg-[#fcebc7]/90" className="-mt-[14cqw] ml-auto w-[42cqw]" />
            <Sparkle className="absolute top-[10cqw] right-[12cqw] size-[4cqw] text-[#e0b04a]/70" />
            <div className="mt-[4cqw] pr-[4cqw] pl-[6cqw]">
              <Handwriting text={page.text} />
              <Signature name={page.author} />
            </div>
          </div>
        </Page>
      );
    case "textOnly":
      return (
        <Page number={number}>
          <div className="flex h-full flex-col px-[14cqw] pt-[18cqw]">
            <Sparkle className="size-[4cqw] text-[#e0b04a]/70" />
            <Handwriting text={page.text} size="text-[4.6cqw]" />
            <Signature name={page.author} />
            <Heart className="mx-auto mt-auto mb-[14cqw] size-[5cqw] text-rose" />
          </div>
        </Page>
      );
    case "twoNotes":
      return (
        <Page number={number}>
          <div className="flex h-full flex-col gap-[7cqw] px-[12cqw] pt-[14cqw]">
            {page.notes.map((note, i) => (
              <div
                key={note.author}
                className={`relative bg-white px-[7cqw] py-[7cqw] shadow-[0_0.6cqw_2cqw_rgba(61,54,50,0.12)] ${i === 0 ? "-rotate-1" : "ml-[8cqw] rotate-1"}`}
              >
                <span
                  className={`absolute -top-[2cqw] left-[8cqw] h-[4.5cqw] w-[16cqw] -rotate-6 ${i === 0 ? "bg-[#dff1e6]" : "bg-[#eeebf8]"}`}
                  aria-hidden
                />
                <Handwriting text={note.text} size="text-[5cqw]" />
                <Signature name={note.author} />
              </div>
            ))}
          </div>
        </Page>
      );
  }
}

// ─── 마지막 페이지 ─────────────────────────────────────
export function ClosingPage({ text, background }: { text: string; background: string }) {
  return (
    <Page className="bg-cover bg-bottom">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={background} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="relative flex h-full flex-col items-center pt-[34cqw] text-[#3d4660]">
        <Heart className="size-[10cqw]" />
        <p className={`${hand} mt-[6cqw] text-center text-[6.4cqw] leading-snug whitespace-pre-line`}>{text}</p>
        <Heart className="mt-[3cqw] size-[4cqw] text-rose" />
      </div>
    </Page>
  );
}
