"use client";

import { useIframeHtml } from "@/lib/use-iframe-html";

type AppFullscreenProps = {
  html: string;
  telegramMode?: boolean;
  onClose: () => void;
  onOpenExternal: () => void;
};

export function AppFullscreen({
  html,
  telegramMode = false,
  onClose,
  onOpenExternal,
}: AppFullscreenProps) {
  const iframeRef = useIframeHtml({ html, telegramMode });

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#07070f]">
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2 safe-top sm:py-2.5">
        <button
          type="button"
          onClick={onClose}
          className="touch-target rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white"
        >
          ← Назад
        </button>
        <span className="min-w-0 truncate text-sm text-white/50">
          Ваше приложение
        </span>
        <button
          type="button"
          onClick={onOpenExternal}
          className="touch-target ml-auto shrink-0 rounded-lg bg-violet-500/20 px-3 py-2 text-xs font-medium text-violet-100"
        >
          🌐 Safari
        </button>
      </div>
      <iframe
        ref={iframeRef}
        title="Приложение"
        className="min-h-0 flex-1 w-full border-0 bg-white"
      />
    </div>
  );
}
