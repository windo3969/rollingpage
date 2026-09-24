import type { Message } from "@/lib/rooms";
import { TAPE_COLORS } from "@/lib/templates";

// 자동 레이아웃: 글자 수에 따라 글씨 크기와 카드 폭을 정한다.
// 짧은 글은 크게, 긴 글은 작게 + 두 칸 폭으로 → 어떤 조합이든 카드 밀도가 비슷해 정돈되어 보인다.
function sizing(length: number) {
  if (length <= 40) return { text: "text-2xl leading-snug", wide: false };
  if (length <= 100) return { text: "text-xl leading-snug", wide: false };
  if (length <= 180) return { text: "text-lg leading-normal", wide: true };
  return { text: "text-base leading-relaxed", wide: true };
}

const TILTS = ["-rotate-1", "rotate-1", "rotate-[0.5deg]", "-rotate-[0.5deg]"];

export function MessageCard({
  message,
  photoUrl,
  index,
  cardClass,
}: {
  message: Message;
  photoUrl?: string;
  index: number;
  cardClass: string;
}) {
  const { text, wide } = sizing(message.content.length);

  return (
    <article
      className={`relative flex flex-col rounded-md px-4 pt-6 pb-4 shadow-[0_2px_10px_rgba(61,54,50,0.08)] ${cardClass} ${TILTS[index % TILTS.length]} ${wide ? "col-span-2" : ""}`}
    >
      {/* 마스킹테이프 */}
      <span
        aria-hidden
        className={`absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rotate-[-4deg] opacity-80 ${TAPE_COLORS[index % TAPE_COLORS.length]}`}
      />

      {photoUrl && (
        <div className="mb-3 bg-white p-1.5 pb-5 shadow-sm">
          {/* signed URL은 매번 바뀌므로 next/image 최적화 캐시 대신 일반 img를 쓴다 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoUrl} alt={`${message.author_name}님이 첨부한 사진`} className="aspect-square w-full object-cover" />
        </div>
      )}

      <p className={`flex-1 font-hand break-words whitespace-pre-line ${text}`}>{message.content}</p>
      <p className="mt-3 text-right font-hand text-lg text-ink-muted">- {message.author_name} -</p>
    </article>
  );
}
