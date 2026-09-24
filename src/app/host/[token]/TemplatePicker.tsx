"use client";

import { useOptimistic, useTransition } from "react";
import { TEMPLATES, type TemplateId } from "@/lib/templates";
import { setTemplate } from "./actions";

export function TemplatePicker({ token, current }: { token: string; current: TemplateId }) {
  const [selected, setSelected] = useOptimistic(current);
  const [, startTransition] = useTransition();

  function choose(id: TemplateId) {
    const formData = new FormData();
    formData.set("template", id);
    startTransition(async () => {
      setSelected(id);
      await setTemplate(token, formData);
    });
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-2" role="radiogroup" aria-label="결과 페이지 템플릿">
      {(Object.keys(TEMPLATES) as TemplateId[]).map((id) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={selected === id}
          onClick={() => choose(id)}
          className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 text-sm ${
            selected === id ? "border-rose font-semibold" : "border-line"
          }`}
        >
          <span className={`size-5 rounded-full border border-line ${TEMPLATES[id].swatch}`} aria-hidden />
          {TEMPLATES[id].name}
        </button>
      ))}
    </div>
  );
}
