import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { CopyButton } from "@/components/CopyButton";
import { KakaoShareButton } from "@/components/KakaoShareButton";
import { PdfInterestButton } from "@/components/PdfInterestButton";
import { SearchSafeNotice } from "@/components/SearchSafeNotice";
import { card } from "@/components/ui";
import { formatDeadline } from "@/lib/format";
import { countMessages, getRoomByHostToken } from "@/lib/rooms";
import { isTemplateId } from "@/lib/templates";
import { TemplatePicker } from "./TemplatePicker";

export const metadata: Metadata = {
  title: "주최자 페이지",
  // URL에 주최자 토큰이 들어 있으므로 외부로 나가는 요청에 Referer를 싣지 않는다.
  referrer: "no-referrer",
};

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

const linkField = "min-w-0 flex-1 rounded-lg border border-line bg-cream px-3 py-2 text-sm";

export default async function HostPage(props: PageProps<"/host/[token]">) {
  const { token } = await props.params;
  const room = await getRoomByHostToken(token);
  if (!room) notFound();

  const messageCount = await countMessages(room.id);
  const base = await origin();
  const shareUrl = `${base}/r/${room.id}`;
  const resultUrl = `${base}/v/${room.result_id}`;
  const hostUrl = `${base}/host/${token}`;

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-10">
        <p className="text-sm text-ink-muted">{room.recipient_name}님에게</p>
        <h1 className="mt-1 font-hand text-3xl font-bold">{room.title}</h1>
        <p className="mt-2 text-sm text-ink-muted">
          작성 마감: {formatDeadline(room.deadline)}
          {room.password_hash && " · 비밀번호 설정됨"}
        </p>
        <p className="mt-4 inline-block rounded-full bg-pastel-mint px-3 py-1 text-sm font-medium">
          지금까지 {messageCount}개의 메시지가 모였어요
        </p>

        <section className={`${card} mt-6`}>
          <h2 className="font-semibold">① 친구들에게 공유할 링크</h2>
          <p className="mt-1 text-sm text-ink-muted">이 링크로 들어온 사람은 메시지를 쓸 수 있어요.</p>
          <div className="mt-3 flex items-center gap-2">
            <input readOnly value={shareUrl} className={linkField} />
            <CopyButton text={shareUrl} />
          </div>
          <div className="mt-3">
            <KakaoShareButton
              url={shareUrl}
              title={`${room.recipient_name}님에게 롤링페이퍼를 남겨주세요 ♡`}
              description={`${formatDeadline(room.deadline)}까지 작성할 수 있어요`}
              buttonTitle="메시지 쓰러 가기"
            />
          </div>
        </section>

        <section className={`${card} mt-4`}>
          <h2 className="font-semibold">② {room.recipient_name}님에게 보낼 결과 링크</h2>
          <p className="mt-1 text-sm text-ink-muted">
            모인 메시지를 한 장으로 볼 수 있는 링크예요. 생일에 {room.recipient_name}님에게 보내주세요.
            작성자들은 이 링크를 모르기 때문에 결과물을 미리 볼 수 없어요.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <input readOnly value={resultUrl} className={linkField} />
            <CopyButton text={resultUrl} />
          </div>
          <div className="mt-3">
            <KakaoShareButton
              url={resultUrl}
              title={`${room.recipient_name}님에게 롤링페이퍼가 도착했어요 ♡`}
              description={`${messageCount}개의 마음이 모였어요`}
              buttonTitle="롤링페이퍼 열어보기"
              label={`카카오톡으로 ${room.recipient_name}님에게 보내기`}
            />
          </div>
          <a
            href={resultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-rose underline underline-offset-4"
          >
            결과물 미리보기 →
          </a>

          <h3 className="mt-6 text-sm font-semibold">결과 페이지 디자인</h3>
          <TemplatePicker token={token} current={isTemplateId(room.template) ? room.template : "paper"} />

          <div className="mt-6 border-t border-line pt-5">
            <PdfInterestButton source="host" recordKey={token} />
          </div>
        </section>

        <section className="mt-4 rounded-2xl bg-pastel-yellow/70 p-5">
          <h2 className="font-semibold">주최자 전용 링크 — 꼭 저장해두세요</h2>
          <p className="mt-1 text-sm">
            지금 보고 있는 이 페이지의 주소예요. 이 링크로만 롤링페이퍼를 관리할 수 있고, 잃어버리면 다시 찾을 수
            없어요. 다른 사람에게는 공유하지 마세요.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <input readOnly value={hostUrl} className={linkField} />
            <CopyButton text={hostUrl} />
          </div>
        </section>

        <div className="mt-8">
          <SearchSafeNotice />
        </div>
      </main>
    </>
  );
}
