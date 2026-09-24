import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/CopyButton";
import { SearchSafeNotice } from "@/components/SearchSafeNotice";
import { hashToken } from "@/lib/hash";
import { createAdminClient } from "@/lib/supabase/admin";

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

function formatDeadline(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(iso));
}

export default async function HostPage(props: PageProps<"/host/[token]">) {
  const { token } = await props.params;

  const { data: room } = await createAdminClient()
    .from("rooms")
    .select("id, title, recipient_name, deadline, password_hash")
    .eq("host_token_hash", hashToken(token))
    .maybeSingle();

  if (!room) notFound();

  const base = await origin();
  const shareUrl = `${base}/r/${room.id}`;
  const hostUrl = `${base}/host/${token}`;

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-10">
      <p className="text-sm text-zinc-500">{room.recipient_name}님에게</p>
      <h1 className="mt-1 text-2xl font-bold">{room.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">
        작성 마감: {formatDeadline(room.deadline)}
        {room.password_hash && " · 비밀번호 설정됨"}
      </p>

      <section className="mt-8 rounded-2xl bg-zinc-100 p-5">
        <h2 className="font-semibold">친구들에게 공유할 링크</h2>
        <p className="mt-1 text-sm text-zinc-600">이 링크로 들어온 사람은 메시지를 쓸 수 있어요.</p>
        <div className="mt-3 flex items-center gap-2">
          <input readOnly value={shareUrl} className="min-w-0 flex-1 rounded-lg bg-white px-3 py-2 text-sm" />
          <CopyButton text={shareUrl} />
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-5">
        <h2 className="font-semibold">주최자 전용 링크 — 꼭 저장해두세요</h2>
        <p className="mt-1 text-sm text-zinc-700">
          지금 보고 있는 이 페이지의 주소예요. 이 링크로만 롤링페이퍼를 관리할 수 있고, 잃어버리면 다시 찾을 수
          없어요. 다른 사람에게는 공유하지 마세요.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <input readOnly value={hostUrl} className="min-w-0 flex-1 rounded-lg bg-white px-3 py-2 text-sm" />
          <CopyButton text={hostUrl} />
        </div>
      </section>

      <div className="mt-8">
        <SearchSafeNotice />
      </div>
    </main>
  );
}
