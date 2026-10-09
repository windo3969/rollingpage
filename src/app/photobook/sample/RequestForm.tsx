"use client";

import { useActionState } from "react";
import { BookIcon } from "@/components/icons";
import { buttonPrimary, errorBox, input, label } from "@/components/ui";
import { PHOTOBOOK_EVENT, type PhotobookSource } from "@/lib/photobook";
import { requestPhotobook, type RequestState } from "./actions";

// 포토북 소책자 PDF 선착순 무료 신청. 신청 수 ÷ 미리보기 수 = 관심 전환 지표.
// resultId: 어느 롤링페이퍼로 PDF를 만들지 (결과·주최자 페이지에서 넘어온 경우)
export function RequestForm({
  source,
  resultId,
  remaining,
}: {
  source: PhotobookSource;
  resultId: string | null;
  remaining: number;
}) {
  const [state, formAction, pending] = useActionState<RequestState, FormData>(requestPhotobook, {});
  const { freeQuota } = PHOTOBOOK_EVENT;
  const closed = remaining <= 0;
  const takenPercent = Math.round(((freeQuota - remaining) / freeQuota) * 100);

  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <span className="inline-block rounded-full bg-pastel-pink px-2.5 py-1 text-xs font-semibold text-rose-deep">
        선착순 {freeQuota}명 무료
      </span>
      <h2 className="mt-3 flex items-center gap-1.5 text-lg font-bold tracking-tight">
        <BookIcon size={20} className="text-rose" />
        포토북 소책자 PDF로 받아보세요
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        안녕하세요, 개발자입니다. 작성하신 소중한 사진과 글을 포토북 소책자 PDF로 만들어 무료로 보내드려요.
      </p>
      <p className="mt-2 text-sm font-medium text-ink">감사합니다, 후기를 여쭤볼게요 :)</p>

      <div className="mt-4">
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
          <p className="mt-1 text-sm text-ink-muted">PDF가 준비되면 입력하신 번호로 보내드릴게요.</p>
        </div>
      ) : closed ? (
        <p className="mt-5 rounded-xl bg-cream px-4 py-4 text-center text-sm text-ink-muted">
          선착순 무료 신청이 마감되었어요. 관심 가져주셔서 고마워요!
        </p>
      ) : (
        <form action={formAction} className="mt-5 flex flex-col gap-4">
          <input type="hidden" name="source" value={source} />
          {resultId && <input type="hidden" name="resultId" value={resultId} />}
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
                <li>이용 목적: 포토북 PDF 전달, 수령 확인 및 후기 요청 연락</li>
                <li>보유 기간: 이벤트 종료 시까지 (종료 후 지체 없이 파기)</li>
                <li>동의를 거부할 수 있으며, 거부하시면 신청이 제한됩니다.</li>
                <li>아래 선택 항목에 동의하지 않으시면 상품 안내·홍보 연락은 하지 않습니다.</li>
              </ul>
            </details>

            {/* 선택 동의: 실물 상품 안내는 광고성 정보이므로 필수 동의와 분리해 따로 받는다 */}
            <label className="mt-3 flex items-start gap-2 border-t border-line pt-3 text-sm text-ink">
              <input type="checkbox" name="marketing" className="mt-0.5 size-4 shrink-0 accent-rose" />
              <span>실물 소책자 할인 소식 받기 (선택)</span>
            </label>
            <p className="mt-1 pl-6">실물 소책자 사진과 함께 특가로 안내해 드려요.</p>
            <details className="mt-2">
              <summary className="cursor-pointer">자세히 보기</summary>
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-4">
                <li>이용 항목: 이름(닉네임), 휴대폰 번호</li>
                <li>이용 목적: 실물 포토북 소책자 상품 및 할인 안내 (광고성 정보, 문자·전화)</li>
                <li>보유 기간: 이벤트 종료 시 또는 동의 철회 시까지</li>
                <li>동의하지 않아도 PDF 신청에는 영향이 없으며, 언제든 수신을 거부할 수 있습니다.</li>
              </ul>
            </details>
          </div>

          {state.error && (
            <p role="alert" className={errorBox}>
              {state.error}
            </p>
          )}

          <button type="submit" disabled={pending} className={`${buttonPrimary} w-full`}>
            {pending ? "주문하는 중…" : "주문하기"}
          </button>
        </form>
      )}
    </section>
  );
}
