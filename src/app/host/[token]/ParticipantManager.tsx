"use client";

import { useActionState, useTransition } from "react";
import { buttonSmall, errorBox, hint, input } from "@/components/ui";
import { PARTICIPANT_MAX } from "@/lib/limits";
import type { Participant } from "@/lib/rooms";
import { addParticipants, removeParticipant, type AddParticipantsState } from "./actions";

export function ParticipantManager({ token, participants }: { token: string; participants: Participant[] }) {
  const [state, formAction, pending] = useActionState<AddParticipantsState, FormData>(
    addParticipants.bind(null, token),
    {},
  );
  const [removing, startRemove] = useTransition();

  function remove(participant: Participant) {
    if (!window.confirm(`${participant.name}님을 명단에서 뺄까요?\n이미 쓴 메시지는 그대로 남아요.`)) return;
    startRemove(() => removeParticipant(token, participant.id));
  }

  return (
    <div className="mt-3">
      {/* 추가에 성공하면 key가 바뀌어 입력창이 비워진다 */}
      <form key={state.added ? `added-${participants.length}` : "form"} action={formAction} className="flex flex-col gap-2">
        <textarea
          name="names"
          rows={3}
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

      {participants.length > 0 && (
        <ul className={`mt-4 flex flex-wrap gap-2 ${removing ? "opacity-60" : ""}`} aria-label="참여자 명단">
          {participants.map((participant) => (
            <li
              key={participant.id}
              className="flex items-center gap-1 rounded-full border border-line bg-cream py-1 pr-1 pl-3 text-sm"
            >
              {participant.name}
              <button
                type="button"
                onClick={() => remove(participant)}
                disabled={removing}
                aria-label={`${participant.name} 명단에서 빼기`}
                className="flex size-6 items-center justify-center rounded-full text-ink-muted hover:bg-line"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
