import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SearchSafeNotice } from "@/components/SearchSafeNotice";
import { ogMetadata } from "@/lib/og";
import { signPhotoUrls } from "@/lib/photos";
import { getMessages, getRoomByResultId } from "@/lib/rooms";
import { isTemplateId, TEMPLATES } from "@/lib/templates";
import { MessageCard } from "./MessageCard";

export async function generateMetadata(props: PageProps<"/v/[resultId]">): Promise<Metadata> {
  // URL에 결과 ID가 들어 있고, 사진 signed URL도 있으므로 Referer를 싣지 않는다.
  const referrer = "no-referrer";
  const room = await getRoomByResultId((await props.params).resultId);
  if (!room) return { title: "롤링페이퍼", referrer };
  return {
    ...ogMetadata(`${room.recipient_name}님에게 롤링페이퍼가 도착했어요 ♡`, "친구들이 마음을 모아 만든 롤링페이퍼예요"),
    referrer,
  };
}

export default async function ResultPage(props: PageProps<"/v/[resultId]">) {
  const { resultId } = await props.params;
  const room = await getRoomByResultId(resultId);
  if (!room) notFound();

  const messages = await getMessages(room.id);
  const photoUrls = await signPhotoUrls(messages.flatMap((m) => (m.photo_path ? [m.photo_path] : [])));
  const template = TEMPLATES[isTemplateId(room.template) ? room.template : "paper"];

  return (
    <div className={`flex flex-1 flex-col ${template.page}`}>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
        <header className="text-center">
          <p className="text-xl text-rose">♡</p>
          <h1 className="mt-2 font-hand text-4xl leading-tight font-bold">{room.title}</h1>
          <p className="mt-3 font-hand text-xl text-ink-muted">
            {room.recipient_name}에게 도착한 {messages.length}개의 마음
          </p>
        </header>

        {messages.length === 0 ? (
          <p className="mt-16 text-center text-ink-muted">아직 도착한 메시지가 없어요.</p>
        ) : (
          // 2열 그리드 + dense: 한 칸 카드가 빈자리를 채우고, 같은 줄 카드는 높이가 맞춰진다
          <div className="mt-12 grid grid-flow-row-dense grid-cols-2 gap-x-3 gap-y-5">
            {messages.map((message, i) => (
              <MessageCard
                key={message.id}
                message={message}
                photoUrl={message.photo_path ? photoUrls.get(message.photo_path) : undefined}
                index={i}
                cardClass={template.card}
              />
            ))}
          </div>
        )}

        <footer className="mt-16 flex flex-col items-center gap-3">
          <p className="font-script text-xl text-ink-muted">Rolling Paper</p>
          <SearchSafeNotice />
        </footer>
      </main>
    </div>
  );
}
