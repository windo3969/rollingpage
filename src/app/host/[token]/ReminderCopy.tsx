"use client";

import { useRef, useState } from "react";
import { buttonSmall, input } from "@/components/ui";

// 미작성자 독촉 메시지 (CLAUDE.md: 알림톡 자동 발송 대신 "복사해서 단톡방에 붙여넣기")
function buildReminder({
  recipientName,
  deadlineText,
  shareUrl,
  names,
}: {
  recipientName: string;
  deadlineText: string;
  shareUrl: string;
  names: string[] | null; // null이면 이름 없이
}) {
  const lines = [`${recipientName}님 생일 롤링페이퍼, 아직 안 쓴 친구들 🙏`];
  if (names) lines.push(names.join(", "));
  lines.push(
    "",
    `${deadlineText}까지 한 줄이라도 남겨주세요 :)`,
    "링크만 누르면 로그인 없이 바로 쓸 수 있어요!",
    shareUrl,
  );
  return lines.join("\n");
}

export function ReminderCopy({
  pendingNames,
  recipientName,
  deadlineText,
  shareUrl,
}: {
  pendingNames: string[];
  recipientName: string;
  deadlineText: string;
  shareUrl: string;
}) {
  const [includeNames, setIncludeNames] = useState(true);
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const generated = buildReminder({
    recipientName,
    deadlineText,
    shareUrl,
    names: includeNames ? pendingNames : null,
  });

  async function copy() {
    const text = textRef.current?.value ?? generated; // 주최자가 고친 내용 그대로 복사
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      textRef.current?.select(); // 클립보드 권한이 없으면 선택해두고 직접 복사하게
    }
  }

  return (
    <div className="mt-5 rounded-xl bg-pastel-yellow/70 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">미작성자에게 보낼 메시지</p>
        <label className="flex items-center gap-1.5 text-xs text-ink-muted">
          <input
            type="checkbox"
            checked={includeNames}
            onChange={(e) => setIncludeNames(e.target.checked)}
            className="accent-rose"
          />
          이름 넣기
        </label>
      </div>
      {/* 이름 넣기를 바꾸면 key가 바뀌어 문구가 다시 만들어진다 (그 전까지는 자유롭게 수정 가능) */}
      <textarea
        key={String(includeNames)}
        ref={textRef}
        defaultValue={generated}
        rows={7}
        aria-label="미작성자에게 보낼 메시지"
        className={`${input} mt-3 resize-none text-sm leading-relaxed`}
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-xs text-ink-muted">복사해서 단톡방에 붙여넣어 주세요.</p>
        <button type="button" onClick={copy} className={buttonSmall}>
          {copied ? "복사됨" : "메시지 복사"}
        </button>
      </div>
    </div>
  );
}
