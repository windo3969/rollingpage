import { HeartIcon } from "@/components/icons";
import type { Message } from "@/lib/rooms";

// 자동 레이아웃: 글자 수에 따라 글씨 크기와 카드 폭을 정한다.
// 짧은 글은 크게, 긴 글은 작게 + 두 칸 폭으로 → 어떤 조합이든 카드 밀도가 비슷해 정돈되어 보인다.
function sizing(length: number) {
  if (length <= 40) return { text: "text-lg leading-snug", wide: false };
  if (length <= 100) return { text: "text-base leading-relaxed", wide: false };
  if (length <= 180) return { text: "text-[15px] leading-relaxed", wide: true };
  return { text: "text-sm leading-relaxed", wide: true };
}

export function MessageCard({
  message,
  photoUrl,
  cardClass,
}: {
  message: Message;
  photoUrl?: string;
  cardClass: string;
}) {
  const { text, wide } = sizing(message.content.length);

  return (
    <article className={`flex flex-col rounded-2xl p-4 ${cardClass} ${wide ? "col-span-2" : ""}`}>
      <header className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-ink-muted">
          {message.author_name.slice(0, 1)}
        </span>
        <span className="text-sm font-medium">{message.author_name}</span>
      </header>

      <p className={`mt-3 flex-1 break-words whitespace-pre-line ${text}`}>{message.content}</p>

      <HeartIcon size={16} className="mt-3 text-rose" />

      {photoUrl && (
        // signed URL은 매번 바뀌므로 next/image 최적화 캐시 대신 일반 img를 쓴다
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={`${message.author_name}님이 첨부한 사진`}
          className="mt-3 aspect-[4/3] w-full rounded-xl object-cover"
        />
      )}
    </article>
  );
}
