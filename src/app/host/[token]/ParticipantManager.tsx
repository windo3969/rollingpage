"use client";

import { useActionState, useState, useTransition } from "react";
import { buttonSmall, errorBox, hint, input } from "@/components/ui";
import { PARTICIPANT_MAX } from "@/lib/limits";
import type { ParticipantStatus } from "@/lib/rooms";
import { addParticipants, removeParticipant, type AddParticipantsState } from "./actions";

type Filter = "all" | "written" | "pending";

// 주최자 대시보드: 참여자별 작성 현황 + 명단 추가/삭제
export function ParticipantManager({
  token,
  participants,
  unlistedCount,
}: {
  token: string;
  participants: ParticipantStatus[];
  unlistedCount: number; // 명단에 없는 사람이 쓴 메시지 수
}) {
  const [state, formAction, pending] = useActionState<AddParticipantsState, FormData>(
    addParticipants.bind(null, token),
    {},
  );
  const [removing, startRemove] = useTransition();
  const [filter, setFilter] = useState<Filter>("all");

  const writtenCount = participants.filter((p) => p.written).length;
  const pendingCount = participants.length - writtenCount;
  const percent = participants.length ? Math.round((writtenCount / participants.length) * 100) : 0;
  const visible = participants.filter((p) =>
    filter === "all" ? true : filter === "written" ? p.written : !p.written,
  );

  function remove(participant: ParticipantStatus) {
    const note = participant.written ? "\n이미 쓴 메시지는 그대로 남아요." : "";
    if (!window.confirm(`${participant.name}님을 명단에서 뺄까요?${note}`)) return;
    startRemove(() => removeParticipant(token, participant.id));
  }

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "전체", count: participants.length },
    { id: "written", label: "작성 완료", count: writtenCount },
    { id: "pending", label: "미작성", count: pendingCount },
  ];

  return (
    <div className="mt-4">
      {participants.length > 0 && (
        <>
          {/* 진행률 */}
          <div>
            <div
              className="h-2 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="작성 진행률"
            >
              <div className="h-full rounded-full bg-mint transition-[width]" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 text-right text-xs text-ink-muted">
              <strong className="font-semibold text-ink">
                {writtenCount} / {participants.length}명
              </strong>{" "}
              작성 완료
            </p>
            {unlistedCount > 0 && (
              <p className="mt-1 text-right text-xs text-ink-muted">명단에 없는 사람이 쓴 메시지 {unlistedCount}개</p>
            )}
          </div>

          {/* 필터 탭 */}
          <div className="mt-4 grid grid-cols-3 gap-1 rounded-full bg-cream p-1" role="tablist" aria-label="작성 여부로 보기">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filter === tab.id}
                onClick={() => setFilter(tab.id)}
                className={`rounded-full py-1.5 text-xs ${
                  filter === tab.id ? "bg-white font-semibold text-ink shadow-sm" : "text-ink-muted"
                }`}
              >
                {tab.label} {tab.count}
              </button>
            ))}
          </div>

          {/* 명단 */}
          <ul className={`mt-3 divide-y divide-line ${removing ? "opacity-60" : ""}`} aria-label="참여자 명단">
            {visible.map((participant) => (
              <li key={participant.id} className="flex items-center gap-3 py-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pastel-pink text-xs font-semibold text-rose-deep">
                  {participant.name.slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">{participant.name}</span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    participant.written ? "bg-pastel-mint text-mint" : "bg-pastel-pink text-rose-deep"
                  }`}
                >
                  {participant.written ? "작성 완료" : "미작성"}
                </span>
                <button
                  type="button"
                  onClick={() => remove(participant)}
                  disabled={removing}
                  aria-label={`${participant.name} 명단에서 빼기`}
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-line"
                >
                  ×
                </button>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="py-6 text-center text-sm text-ink-muted">
                {filter === "written" ? "아직 작성한 사람이 없어요." : "모두 작성했어요!"}
              </li>
            )}
          </ul>
        </>
      )}

      {/* 명단 추가 — 추가에 성공하면 key가 바뀌어 입력창이 비워진다 */}
      <form
        key={state.added ? `added-${participants.length}` : "form"}
        action={formAction}
        className={`flex flex-col gap-2 ${participants.length > 0 ? "mt-5 border-t border-line pt-4" : ""}`}
      >
        <textarea
          name="names"
          rows={participants.length > 0 ? 2 : 3}
          placeholder={"이름을 줄바꿈이나 쉼표로 구분해 입력하세요\n예: 수연, 민지, 지훈"}
          aria-label="참여자 이름"
          className={`${input} resize-none text-sm`}
        />
        <div className="flex items-center justify-between gap-2">
          <span className={hint}>
            {participants.length}/{PARTICIPANT_MAX}명
          </span>
          <button type="submit" disabled={pending} className={`${buttonSmall} disabled:bg-rose-soft`}>
            {pending ? "추가 중…" : "명단에 추가"}
          </button>
        </div>
      </form>

      {state.error && (
        <p role="alert" className={`${errorBox} mt-2`}>
          {state.error}
        </p>
      )}
    </div>
  );
}
