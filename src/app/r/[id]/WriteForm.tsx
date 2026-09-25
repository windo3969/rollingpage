"use client";

import imageCompression from "browser-image-compression";
import { useActionState, useEffect, useState } from "react";
import { HeartIcon, ImageIcon, LockIcon } from "@/components/icons";
import { MessageCard } from "@/components/MessageCard";
import { buttonPrimary, buttonSecondary, errorBox, hint, input, label } from "@/components/ui";
import { MESSAGE_MAX_LENGTH, PHOTO_MAX_BYTES } from "@/lib/limits";
import type { Participant } from "@/lib/rooms";
import { submitMessage, type SubmitState } from "./actions";
import { AuthorField } from "./AuthorField";
import { HintBox } from "./HintBox";

// 업로드 전 브라우저에서 압축: 저장·트래픽 비용 절감 + 서버 요청 크기 제한 준수
const COMPRESSION = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  fileType: "image/jpeg",
  initialQuality: 0.85,
  useWebWorker: true,
};

type Photo = { file: File; previewUrl: string };

export function WriteForm({
  roomId,
  recipientName,
  participants,
  preview,
}: {
  roomId: string;
  recipientName: string;
  participants: Participant[];
  preview: { pageClass: string; cardClass: string }; // 결과 페이지 템플릿 색 (내 메시지 미리보기용)
}) {
  const [state, formAction, pending] = useActionState<SubmitState, FormData>(submitMessage.bind(null, roomId), {});
  const [dismissedId, setDismissedId] = useState<string | null>(null); // "하나 더 쓰기"로 닫은 완료 화면
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState<string | null>(null); // 명단에서 고른 참여자 ID, 또는 NOT_LISTED
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [photoStatus, setPhotoStatus] = useState<"idle" | "compressing" | "error">("idle");

  // 서버 검증 실패로 되돌아왔을 때 입력했던 내용을 복원 (액션 후 폼이 자동 리셋되므로)
  const [restoredFrom, setRestoredFrom] = useState(state.values);
  if (state.values !== restoredFrom) {
    setRestoredFrom(state.values);
    if (state.values) {
      setContent(state.values.content);
      setAuthor(state.values.participantId);
    }
  }

  // 미리보기 URL 정리
  useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo.previewUrl);
  }, [photo]);

  async function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const original = e.target.files?.[0];
    e.target.value = ""; // 같은 파일을 다시 골라도 change 이벤트가 나도록
    if (!original) return;

    setPhotoStatus("compressing");
    try {
      const compressed = await imageCompression(original, COMPRESSION);
      if (compressed.size > PHOTO_MAX_BYTES) throw new Error("too large");
      const file = new File([compressed], "photo.jpg", { type: "image/jpeg" });
      setPhoto({ file, previewUrl: URL.createObjectURL(file) });
      setPhotoStatus("idle");
    } catch {
      setPhoto(null);
      setPhotoStatus("error");
    }
  }

  // 원본 파일 input에는 name이 없으므로, 압축된 파일만 FormData에 실어 보낸다
  function submit(formData: FormData) {
    if (photo) formData.set("photo", photo.file);
    formAction(formData);
  }

  // 작성 완료 화면: 결과 페이지와 같은 카드로 "내 메시지"만 미리 보여준다 (다른 사람 메시지는 보여주지 않음)
  const saved = state.saved && state.saved.id !== dismissedId ? state.saved : null;

  function writeAgain() {
    setDismissedId(saved?.id ?? null);
    setContent("");
    setAuthor(null);
    setPhoto(null);
    setPhotoStatus("idle");
    window.scrollTo({ top: 0 });
  }

  if (saved) {
    return (
      <div className="text-center">
        <HeartIcon size={36} className="mx-auto text-rose" />
        <p className="mt-3 text-xl font-bold">메시지를 남겼어요!</p>
        <p className="mt-2 text-sm text-ink-muted">{recipientName}님에게 이렇게 전달될 거예요.</p>

        <div className={`mt-6 rounded-2xl p-3 text-left ${preview.pageClass}`}>
          <div className="grid grid-cols-2 gap-3">
            <MessageCard
              message={{ author_name: saved.authorName, content: saved.content }}
              photoUrl={photo?.previewUrl}
              cardClass={preview.cardClass}
            />
          </div>
        </div>
        <p className="mt-3 flex items-center justify-center gap-1 text-xs text-ink-muted">
          <LockIcon size={13} />
          다른 친구들의 메시지는 {recipientName}님만 볼 수 있어요.
        </p>

        <button type="button" onClick={writeAgain} className={`${buttonSecondary} mt-6 w-full`}>
          하나 더 쓰기
        </button>
      </div>
    );
  }

  return (
    <form action={submit} className="flex flex-col gap-5">
      <HintBox />

      <label className="flex flex-col gap-2">
        <span className={label}>메시지</span>
        <textarea
          name="content"
          required
          rows={8}
          maxLength={MESSAGE_MAX_LENGTH}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="여기에 메시지를 적어주세요..."
          className={`${input} resize-none leading-relaxed`}
        />
        <span className={`${hint} self-end`}>
          {content.length}/{MESSAGE_MAX_LENGTH}
        </span>
      </label>

      <div className="flex flex-col gap-2">
        <span className={label}>
          사진 <span className="font-normal text-ink-muted">(선택, 1장)</span>
        </span>
        {photo ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element -- 로컬 blob 미리보기 */}
            <img src={photo.previewUrl} alt="첨부한 사진 미리보기" className="w-full rounded-lg object-cover" />
            <button
              type="button"
              onClick={() => setPhoto(null)}
              className="absolute top-2 right-2 rounded-full bg-ink/70 px-3 py-1 text-sm text-white"
            >
              삭제
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-ink-muted/40 bg-white py-10 text-center text-ink-muted">
            <ImageIcon size={28} />
            <span className="text-sm">
              {photoStatus === "compressing" ? "사진 준비 중…" : "사진을 첨부해주세요"}
            </span>
            <span className="text-xs text-ink-muted/80">(1장만 가능)</span>
            <input type="file" accept="image/*" onChange={onPhotoChange} className="sr-only" />
          </label>
        )}
        {photoStatus === "error" && (
          <p role="alert" className={errorBox}>
            사진을 불러오지 못했어요. 다른 사진을 골라주세요.
          </p>
        )}
      </div>

      <AuthorField
        participants={participants}
        selected={author}
        onSelect={setAuthor}
        defaultName={state.values?.authorName}
      />

      {state.error && (
        <p role="alert" className={errorBox}>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || photoStatus === "compressing"}
        className={`${buttonPrimary} mt-2 w-full`}
      >
        {pending ? "보내는 중…" : "작성 완료"}
      </button>
    </form>
  );
}
