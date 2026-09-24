"use client";

import { useActionState } from "react";
import { buttonPrimary, errorBox, input } from "@/components/ui";
import { unlockRoom, type UnlockState } from "./actions";

export function PasswordGate({ roomId }: { roomId: string }) {
  const [state, formAction, pending] = useActionState<UnlockState, FormData>(unlockRoom.bind(null, roomId), {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p className="text-sm text-ink-muted">주최자가 비밀번호를 설정한 롤링페이퍼예요.</p>
      <input
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="비밀번호"
        aria-label="비밀번호"
        className={input}
      />
      {state.error && (
        <p role="alert" className={errorBox}>
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${buttonPrimary} w-full`}>
        {pending ? "확인 중…" : "들어가기"}
      </button>
    </form>
  );
}
