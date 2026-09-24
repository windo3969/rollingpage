"use client";

import { useState } from "react";
import { buttonSmall } from "./ui";

export function CopyButton({ text, label = "복사" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("아래 링크를 복사하세요", text);
    }
  }

  return (
    <button type="button" onClick={copy} className={buttonSmall}>
      {copied ? "복사됨" : label}
    </button>
  );
}
