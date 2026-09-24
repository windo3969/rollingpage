import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { SearchSafeNotice } from "@/components/SearchSafeNotice";
import { formatDeadline } from "@/lib/format";
import { getRoom, hasRoomAccess, isClosed } from "@/lib/rooms";
import { PasswordGate } from "./PasswordGate";
import { WriteForm } from "./WriteForm";

export const metadata: Metadata = {
  title: "롤링페이퍼 작성",
};

export default async function WritePage(props: PageProps<"/r/[id]">) {
  const { id } = await props.params;
  const room = await getRoom(id);
  if (!room) notFound();

  const closed = isClosed(room);
  const unlocked = await hasRoomAccess(room);

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-10">
        <p className="text-sm text-ink-muted">{room.recipient_name}님에게</p>
        <h1 className="mt-1 font-hand text-3xl font-bold">{room.title}</h1>
        <p className="mt-2 text-sm text-ink-muted">작성 마감: {formatDeadline(room.deadline)}</p>

        <div className="mt-8">
          {closed ? (
            <div className="rounded-2xl bg-white px-6 py-12 text-center">
              <p className="font-semibold">작성 기간이 끝났어요</p>
              <p className="mt-2 text-sm text-ink-muted">더 이상 메시지를 남길 수 없어요.</p>
            </div>
          ) : unlocked ? (
            <WriteForm roomId={room.id} recipientName={room.recipient_name} />
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
