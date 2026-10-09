"use client";

import { useActionState, useEffect, useState } from "react";
import { submitFeedback, type FeedbackPage, type FeedbackState } from "@/lib/feedback";
import { buttonPrimary, errorBox, input } from "./ui";

const RATINGS = [
  { value: "good", label: "좋았어요" },
  { value: "okay", label: "보통이에요" },
  { value: "bad", label: "아쉬워요" },
] as const;

// "개발자에게 의견 보내기" 링크 + 아래에서 올라오는 익명 피드백 창
export function FeedbackButton({ page }: { page: FeedbackPage }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-ink-muted underline underline-offset-4 print:hidden"
      >
        개발자에게 의견 보내기
      </button>
      {/* 열 때마다 새로 마운트해서 이전 입력·완료 상태가 남지 않게 한다 */}
      {open && <FeedbackSheet page={page} onClose={() => setOpen(false)} />}
    </>
  );
}

function FeedbackSheet({ page, onClose }: { page: FeedbackPage; onClose: () => void }) {
  const [state, formAction, pending] = useActionState<FeedbackState, FormData>(submitFeedback.bind(null, page), {});
  // 보내기 실패 시 폼이 자동 리셋되어도 입력이 남도록 제어 컴포넌트로 둔다
  const [rating, setRating] = useState<string>("");
  const [message, setMessage] = useState("");

  // Esc로 닫기 + 열려 있는 동안 뒤 페이지 스크롤 막기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="개발자에게 의견 보내기"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-white px-5 pt-5 pb-8 text-left"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">개발자에게 의견 보내기</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex size-8 items-center justify-center rounded-full text-xl text-ink-muted hover:bg-line"
          >
            ×
          </button>
        </div>

        {state.done ? (
          <div role="status" className="py-8 text-center">
            <p className="font-semibold">고마워요! 꼼꼼히 읽어볼게요.</p>
            <button type="button" onClick={onClose} className={`${buttonPrimary} mt-6 w-full`}>
              닫기
            </button>
          </div>
        ) : (
          <form action={formAction} className="mt-4 flex flex-col gap-4">
            <p className="text-sm text-ink-muted">
              불편했던 점, 바라는 점을 자유롭게 남겨주세요. <strong className="font-semibold text-ink">익명</strong>으로
              전달돼요.
            </p>

            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="이용해 보니 어땠나요?">
              {RATINGS.map((r) => (
                <label
                  key={r.value}
                  className={`cursor-pointer rounded-full border py-2 text-center text-sm ${
                    rating === r.value ? "border-rose bg-pastel-pink font-semibold" : "border-line"
                  }`}
                >
                  <input
                    type="radio"
                    name="rating"
                    value={r.value}
                    checked={rating === r.value}
                    onChange={() => setRating(r.value)}
                    className="sr-only"
                  />
                  {r.label}
                </label>
              ))}
            </div>

            <label className="flex flex-col gap-1.5">
              <textarea
                name="message"
                rows={4}
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="예: 사진을 여러 장 올리고 싶어요"
                aria-label="자유 의견"
                className={`${input} resize-none text-sm leading-relaxed`}
              />
              <span className="flex justify-between text-xs text-ink-muted">
                <span>이름이나 연락처는 적지 말아주세요.</span>
                <span>{message.length}/1000</span>
              </span>
            </label>

            {state.error && (
              <p role="alert" className={errorBox}>
                {state.error}
              </p>
            )}

            <button type="submit" disabled={pending} className={`${buttonPrimary} w-full`}>
              {pending ? "보내는 중…" : "보내기"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
