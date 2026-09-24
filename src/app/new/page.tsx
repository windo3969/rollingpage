import type { Metadata } from "next";
import { SearchSafeNotice } from "@/components/SearchSafeNotice";
import { CreateRoomForm } from "./CreateRoomForm";

export const metadata: Metadata = {
  title: "롤링페이퍼 만들기",
};

export default function NewRoomPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-10">
      <h1 className="text-2xl font-bold">롤링페이퍼 만들기</h1>
      <p className="mt-2 text-sm text-zinc-600">만든 뒤 링크를 친구들에게 공유하세요.</p>
      <div className="mt-8">
        <CreateRoomForm />
      </div>
      <div className="mt-8">
        <SearchSafeNotice />
      </div>
    </main>
  );
}
