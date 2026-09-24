"use client";

import { useActionState } from "react";
import { createRoom, type CreateRoomState } from "./actions";

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base outline-none focus:border-zinc-900";

// 한국 시간 기준 오늘 날짜 (YYYY-MM-DD)
function todayKst() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function CreateRoomForm() {
  const [state, formAction, pending] = useActionState<CreateRoomState, FormData>(createRoom, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">받는 사람 이름</span>
        <input
          name="recipientName"
          required
          maxLength={50}
          placeholder="예: 김민지"
          defaultValue={state.values?.recipientName}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">롤링페이퍼 제목</span>
        <input
          name="title"
          required
          maxLength={100}
          placeholder="예: 민지의 스물다섯 번째 생일"
          defaultValue={state.values?.title}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">작성 마감일</span>
        <input
          name="deadline"
          type="date"
          required
          min={todayKst()}
          defaultValue={state.values?.deadline}
          className={inputClass}
        />
        <span className="text-xs text-zinc-500">마감일 밤 11시 59분까지 작성할 수 있어요.</span>
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">
          비밀번호 <span className="font-normal text-zinc-500">(선택)</span>
        </span>
        <input
          name="password"
          type="password"
          minLength={4}
          maxLength={50}
          autoComplete="new-password"
          placeholder="설정하면 비밀번호를 아는 사람만 작성할 수 있어요"
          className={inputClass}
        />
      </label>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-xl bg-zinc-900 py-4 text-base font-semibold text-white disabled:opacity-50"
      >
        {pending ? "만드는 중…" : "롤링페이퍼 만들기"}
      </button>
    </form>
  );
}
