import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { SearchSafeNotice } from "@/components/SearchSafeNotice";
import { pageTitle } from "@/components/ui";
import { CreateRoomForm } from "./CreateRoomForm";

export const metadata: Metadata = {
  title: "롤링페이퍼 만들기",
};

export default function NewRoomPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-10">
        <h1 className={pageTitle}>방 만들기</h1>
        <p className="mt-2 text-sm text-ink-muted">소중한 사람을 위한 롤링페이퍼를 만들어보세요.</p>
        <div className="mt-8">
          <CreateRoomForm />
        </div>
        <div className="mt-8">
          <SearchSafeNotice />
        </div>
      </main>
    </>
  );
}
