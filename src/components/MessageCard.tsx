import type { Message } from "@/lib/rooms";
import { ZoomablePhoto } from "./ZoomablePhoto";

// 결과 페이지와 작성 완료 화면(내 메시지 미리보기)이 같은 카드를 쓴다.
// 2열 벽돌(masonry) 배치(columns-2) 안에 놓인다: 카드는 자기 높이만큼만 차지하고 빈틈 없이 쌓인다.

// 자동 레이아웃: 카드 폭은 모두 한 칸, 글자 수에 따라 글씨 크기만 조정한다.
// 짧은 글은 크게, 긴 글은 작게 → 카드마다 밀도가 비슷해 정돈되어 보인다.
function textSize(length: number) {
  if (length <= 40) return "text-lg leading-snug";
  if (length <= 100) return "text-base leading-relaxed";
  if (length <= 250) return "text-[15px] leading-relaxed";
  return "text-sm leading-relaxed";
}

export function MessageCard({
  message,
  photoUrl,
  cardClass,
}: {
  message: Pick<Message, "author_name" | "content">;
  photoUrl?: string;
  cardClass: string;
}) {
  return (
    <article className={`mb-3 break-inside-avoid overflow-hidden rounded-2xl ${cardClass}`}>
      {/* 사진은 카드 맨 위, 가장자리까지 꽉 차게 + 원본 비율 그대로 (자르지 않음). 누르면 크게 보기 */}
      {photoUrl && <ZoomablePhoto src={photoUrl} alt={`${message.author_name}님이 첨부한 사진`} />}

      <div className="p-4">
        <header className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-ink-muted">
            {message.author_name.slice(0, 1)}
          </span>
          <span className="text-sm font-medium">{message.author_name}</span>
        </header>

        <p className={`mt-3 break-words whitespace-pre-line ${textSize(message.content.length)}`}>{message.content}</p>
      </div>
    </article>
  );
}
