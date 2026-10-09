"use client";

import Link from "next/link";
import { recordPdfInterest, type PdfInterestSource } from "@/lib/events";
import { BookIcon } from "./icons";

// 포토북 미리보기 버튼. 누르면 수요 기록(events.pdf_interest)을 남기고 샘플 포토북 페이지로 이동한다.
// 기록은 기다리지 않는다: 실패해도 이동에는 영향을 주지 않는다.
// resultId: 신청 시 어느 롤링페이퍼로 PDF를 만들지 알리기 위해 넘긴다.
//   주최자 페이지에서도 주최자 토큰이 아니라 결과 ID를 넘겨, 관리 권한이 다른 페이지 주소에 남지 않게 한다.
export function PdfInterestButton({
  source,
  recordKey,
  resultId,
}: {
  source: PdfInterestSource;
  recordKey: string;
  resultId: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Link
        // from: 미리보기의 뒤로가기가 이전 페이지로 돌아가게 하는 표시, r: 롤링페이퍼(결과 ID)
        href={`/photobook/sample?from=${source}&r=${resultId}`}
        onClick={() => {
          recordPdfInterest(source, recordKey).catch(() => {});
        }}
        className="inline-flex items-center gap-2 rounded-full border border-rose bg-white px-5 py-3 text-sm font-semibold text-rose"
      >
        <BookIcon size={18} />
        포토북 미리보기
      </Link>
      <p className="text-xs text-ink-muted">메시지와 사진을 한 권의 포토북으로 · PDF 무료</p>
    </div>
  );
}
