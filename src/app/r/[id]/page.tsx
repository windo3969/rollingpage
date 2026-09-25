import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { CalendarIcon } from "@/components/icons";
import { SearchSafeNotice } from "@/components/SearchSafeNotice";
import { card, pageTitle } from "@/components/ui";
import { formatDeadline } from "@/lib/format";
import { ogMetadata } from "@/lib/og";
import { getParticipants, getRoom, hasRoomAccess, isClosed } from "@/lib/rooms";
import { PasswordGate } from "./PasswordGate";
import { WriteForm } from "./WriteForm";

export async function generateMetadata(props: PageProps<"/r/[id]">): Promise<Metadata> {
  const room = await getRoom((await props.params).id);
  if (!room) return { title: "롤링페이퍼" };
  return ogMetadata(
    `${room.recipient_name}님에게 롤링페이퍼를 남겨주세요 ♡`,
    `${formatDeadline(room.deadline)}까지 작성할 수 있어요`,
  );
}

export default async function WritePage(props: PageProps<"/r/[id]">) {
  const { id } = await props.params;
  const room = await getRoom(id);
  if (!room) notFound();

  const closed = isClosed(room);
  const unlocked = await hasRoomAccess(room);
  // 명단(친구 이름)은 작성할 수 있는 사람에게만 내려준다 (비밀번호 통과 전·마감 후에는 조회하지 않음)
  const participants = unlocked && !closed ? await getParticipants(room.id) : [];

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-10">
        <p className="text-sm text-ink-muted">{room.recipient_name}님에게</p>
        <h1 className={`mt-1 ${pageTitle}`}>{room.title}</h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
          <CalendarIcon size={15} />
          {formatDeadline(room.deadline)}까지 작성할 수 있어요
        </p>

        <div className="mt-8">
          {closed ? (
            <div className={`${card} px-6 py-12 text-center`}>
              <p className="font-semibold">작성 기간이 끝났어요</p>
              <p className="mt-2 text-sm text-ink-muted">더 이상 메시지를 남길 수 없어요.</p>
            </div>
          ) : unlocked ? (
            <WriteForm roomId={room.id} recipientName={room.recipient_name} participants={participants} />
          ) : (
            <PasswordGate roomId={room.id} />
          )}
        </div>

        <div className="mt-8">
          <SearchSafeNotice />
        </div>
      </main>
    </>
  );
}
