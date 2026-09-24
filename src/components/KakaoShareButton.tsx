"use client";

import { useEffect, useState } from "react";
import { OG_IMAGE } from "@/lib/site";

// Kakao JavaScript SDK — 버전을 올릴 때는 integrity 값도 함께 바꾼다
// (https://developers.kakao.com/docs/latest/ko/javascript/download)
const KAKAO_SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js";
const KAKAO_SDK_INTEGRITY =
  "sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy";

type KakaoLink = { mobileWebUrl: string; webUrl: string };
type KakaoSdk = {
  init(key: string): void;
  isInitialized(): boolean;
  Share: {
    sendDefault(options: {
      objectType: "feed";
      content: {
        title: string;
        description: string;
        imageUrl: string;
        imageWidth: number;
        imageHeight: number;
        link: KakaoLink;
      };
      buttons: { title: string; link: KakaoLink }[];
    }): void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

// SDK는 페이지당 한 번만 불러오고, 버튼이 여러 개여도 모두 같은 Promise를 기다린다.
// (next/script는 같은 id의 두 번째 인스턴스에 onReady를 호출하지 않아 두 번째 버튼이 비활성으로 남았다)
let sdkPromise: Promise<KakaoSdk> | null = null;

function loadKakaoSdk(appKey: string): Promise<KakaoSdk> {
  sdkPromise ??= new Promise<KakaoSdk>((resolve, reject) => {
    const init = () => {
      if (!window.Kakao) return reject(new Error("Kakao SDK not found"));
      if (!window.Kakao.isInitialized()) window.Kakao.init(appKey);
      resolve(window.Kakao);
    };
    if (window.Kakao) return init();

    const script = document.createElement("script");
    script.src = KAKAO_SDK_SRC;
    script.integrity = KAKAO_SDK_INTEGRITY;
    script.crossOrigin = "anonymous";
    script.async = true;
    script.onload = init;
    script.onerror = () => {
      sdkPromise = null; // 다음 마운트 때 다시 시도
      reject(new Error("Kakao SDK failed to load"));
    };
    document.head.appendChild(script);
  });
  return sdkPromise;
}

type Props = {
  url: string;
  title: string;
  description: string;
  buttonTitle: string;
  label?: string;
};

export function KakaoShareButton({
  url,
  title,
  description,
  buttonTitle,
  label = "카카오톡으로 공유",
}: Props) {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!appKey) return;
    let active = true;
    loadKakaoSdk(appKey).then(
      () => active && setReady(true),
      (error) => console.error(error),
    );
    return () => {
      active = false;
    };
  }, [appKey]);

  // 키가 없으면(로컬에서 아직 설정 전) 버튼을 숨기고 링크 복사만 쓰게 한다
  if (!appKey) return null;

  function share() {
    const link = { mobileWebUrl: url, webUrl: url };
    window.Kakao?.Share.sendDefault({
      objectType: "feed",
      content: {
        title,
        description,
        imageUrl: new URL(OG_IMAGE.path, url).toString(),
        imageWidth: OG_IMAGE.width,
        imageHeight: OG_IMAGE.height,
        link,
      },
      buttons: [{ title: buttonTitle, link }],
    });
  }

  return (
    <button
      type="button"
      onClick={share}
      disabled={!ready}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FEE500] py-3 text-sm font-semibold text-[#191919] disabled:opacity-50"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#191919"
          d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7l-1 3.6c-.1.3.3.6.6.4l4.2-2.8c.5.1 1 .1 1.5.1 5.5 0 10-3.6 10-8S17.5 3 12 3z"
        />
      </svg>
      {label}
    </button>
  );
}
