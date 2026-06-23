"use client";

import { useIframeHtml } from "@/lib/use-iframe-html";

type AppFullscreenProps = {
  html: string;
  appId?: string | null;
  telegramMode?: boolean;
  onClose: () => void;
};

export function AppFullscreen({
  html,
  appId = null,
  telegramMode = false,
  onClose,
}: AppFullscreenProps) {
  const iframeRef = useIframeHtml({ html, appId, telegramMode });

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
      </div>
      <iframe
        ref={iframeRef}
        title="Приложение"
        className="min-h-0 flex-1 w-full border-0 bg-white"
      />
    </div>
  );
}
