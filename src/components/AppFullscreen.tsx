"use client";

import { prepareHtmlForPreview } from "@/lib/prepare-html-for-preview";
import { IFRAME_SANDBOX } from "@/lib/telegram-env";

type AppFullscreenProps = {
  html: string;
  onClose: () => void;
  onOpenExternal: () => void;
};

export function AppFullscreen({ html, onClose, onOpenExternal }: AppFullscreenProps) {
  const prepared = prepareHtmlForPreview(html);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#07070f]">
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2.5 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white"
        >
          ← Назад
        </button>
        <span className="text-sm text-white/50">Ваше приложение</span>
        <button
          type="button"
          onClick={onOpenExternal}
          className="ml-auto rounded-lg bg-violet-500/20 px-3 py-2 text-xs font-medium text-violet-100"
        >
          🌐 Браузер
        </button>
      </div>
      <iframe
        title="Приложение"
        srcDoc={prepared}
        sandbox={IFRAME_SANDBOX}
        className="min-h-0 flex-1 w-full border-0 bg-white"
      />
    </div>
  );
}
