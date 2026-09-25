"use client";

import { input, label } from "@/components/ui";
import { AUTHOR_MAX_LENGTH } from "@/lib/limits";
import type { Participant } from "@/lib/rooms";

// 명단에 없는 사람을 뜻하는 선택값 (participantId는 빈 값으로 전송된다)
export const NOT_LISTED = "";

// 보내는 사람: 명단이 있으면 이름을 골라 선택, "명단에 없어요"를 고르면 직접 입력.
// 명단이 없는 방은 직접 입력만.
export function AuthorField({
  participants,
  selected,
  onSelect,
  defaultName,
}: {
  participants: Participant[];
  selected: string | null;
  onSelect: (value: string) => void;
  defaultName?: string;
}) {
  const nameInput = (
    <input
      name="authorName"
      required
      maxLength={AUTHOR_MAX_LENGTH}
      placeholder="이름 또는 닉네임"
      aria-label="보내는 사람 이름"
      defaultValue={defaultName}
      className={input}
    />
  );

  if (participants.length === 0) {
    return (
      <label className="flex flex-col gap-2">
        <span className={label}>보내는 사람</span>
        {nameInput}
      </label>
    );
  }

  const chip = (value: string, text: string) => (
    <label
      key={value || "not-listed"}
      className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-rose/40 ${
        selected === value ? "border-rose bg-pastel-pink font-semibold text-ink" : "border-line bg-white text-ink"
      }`}
    >
      <input
        type="radio"
        name="participantId"
        value={value}
        required
        checked={selected === value}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      {text}
    </label>
  );

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className={`${label} mb-2`}>보내는 사람</legend>
      <p className="-mt-1 text-xs text-ink-muted">내 이름을 골라주세요.</p>
      <div className="flex flex-wrap gap-2">
        {participants.map((p) => chip(p.id, p.name))}
        {chip(NOT_LISTED, "명단에 없어요")}
      </div>
      {selected === NOT_LISTED && <div className="mt-1">{nameInput}</div>}
    </fieldset>
  );
}
