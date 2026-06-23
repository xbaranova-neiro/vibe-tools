"use client";

import { openHtmlInNewTab, prepareHtmlForPreview } from "@/lib/prepare-html-for-preview";

type ToolbarProps = {
  html: string | null;
  title: string;
  onReset: () => void;
};

export function Toolbar({ html, title, onReset }: ToolbarProps) {
  const downloadHtml = () => {
    if (!html) return;
    const prepared = prepareHtmlForPreview(html);
    const blob = new Blob([prepared], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      openHtmlInNewTab(html);
      URL.revokeObjectURL(url);
      return;
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase() || "my-app"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={downloadHtml}
        disabled={!html}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ⬇ Скачать HTML
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        🔄 Начать заново
      </button>
      {html && (
        <span className="ml-auto text-xs text-white/40">
          Данные хранятся в браузере · скачайте HTML, чтобы не потерять
        </span>
      )}
    </div>
  );
}
