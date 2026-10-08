"use client";

import { useActionState } from "react";
import { BookIcon } from "@/components/icons";
import { buttonPrimary, errorBox, input, label } from "@/components/ui";
import { PHOTOBOOK_EVENT, type PhotobookSource } from "@/lib/photobook";
import { requestPhotobook, type RequestState } from "./actions";

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

// 실물 포토북(소책자) 선착순 무료 제작 신청. 신청 수 ÷ 미리보기 수 = 구매 전환 지표.
export function RequestForm({ source, remaining }: { source: PhotobookSource; remaining: number }) {
  const [state, formAction, pending] = useActionState<RequestState, FormData>(requestPhotobook, {});
  const { price, freeQuota } = PHOTOBOOK_EVENT;
  const closed = remaining <= 0;
  const takenPercent = Math.round(((freeQuota - remaining) / freeQuota) * 100);

  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <span className="inline-block rounded-full bg-pastel-pink px-2.5 py-1 text-xs font-semibold text-rose-deep">
        선착순 {freeQuota}명 무료 제작
      </span>
      <h2 className="mt-3 flex items-center gap-1.5 text-lg font-bold tracking-tight">
        <BookIcon size={20} className="text-rose" />
        실물 포토북으로 받아보세요
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        친구들의 메시지와 사진을 담은 소책자 포토북을 만들어 보내드려요.
      </p>

      <p className="mt-4 flex items-baseline gap-2">
        <span className="text-sm text-ink-muted line-through">{won(price)}</span>
        <span className="text-xl font-bold text-rose">0원</span>
        <span className="text-xs text-ink-muted">이벤트 기간 무료</span>
      </p>

      <div className="mt-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-rose" style={{ width: `${takenPercent}%` }} />
        </div>
        <p className="mt-1.5 text-right text-xs text-ink-muted">
          남은 자리 <strong className="font-semibold text-ink">{remaining}명</strong> / {freeQuota}명
        </p>
      </div>

      {state.done ? (
        <div role="status" className="mt-5 rounded-xl bg-pastel-mint px-4 py-5 text-center">
          <p className="font-semibold">신청이 완료됐어요!</p>
          <p className="mt-1 text-sm text-ink-muted">입력하신 번호로 연락드려 받으실 주소를 여쭤볼게요.</p>
        </div>
      ) : closed ? (
        <p className="mt-5 rounded-xl bg-cream px-4 py-4 text-center text-sm text-ink-muted">
          선착순 무료 제작이 마감되었어요. 관심 가져주셔서 고마워요!
        </p>
      ) : (
        <form action={formAction} className="mt-5 flex flex-col gap-4">
          <input type="hidden" name="source" value={source} />
          <label className="flex flex-col gap-2">
            <span className={label}>이름 (닉네임)</span>
            <input
              name="name"
              required
              maxLength={30}
              autoComplete="name"
              defaultValue={state.values?.name}
              placeholder="연락드릴 때 부를 이름"
              className={input}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={label}>휴대폰 번호</span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              required
              autoComplete="tel"
              defaultValue={state.values?.phone}
              placeholder="010-1234-5678"
              className={input}
            />
          </label>

          {/* 개인정보보호법: 수집 항목·목적·보유 기간·거부 권리를 알리고 동의를 받는다 */}
          <div className="rounded-xl bg-cream p-3.5 text-xs leading-relaxed text-ink-muted">
            <label className="flex items-start gap-2 text-sm text-ink">
              <input type="checkbox" name="consent" required className="mt-0.5 size-4 shrink-0 accent-rose" />
              <span>개인정보 수집·이용에 동의합니다 (필수)</span>
            </label>
            <details className="mt-2">
              <summary className="cursor-pointer">자세히 보기</summary>
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-4">
                <li>수집 항목: 이름(닉네임), 휴대폰 번호</li>
                <li>이용 목적: 무료 포토북 제작 안내 및 배송지 확인 연락</li>
                <li>보유 기간: 이벤트 종료 시까지 (종료 후 지체 없이 파기)</li>
                <li>동의를 거부할 수 있으며, 거부하시면 신청이 제한됩니다.</li>
                <li>광고·홍보 목적으로는 사용하지 않습니다.</li>
              </ul>
            </details>
          </div>

          {state.error && (
            <p role="alert" className={errorBox}>
              {state.error}
            </p>
          )}

          <button type="submit" disabled={pending} className={`${buttonPrimary} w-full`}>
            {pending ? "신청하는 중…" : "무료로 신청하기"}
          </button>
        </form>
      )}
    </section>
  );
}
