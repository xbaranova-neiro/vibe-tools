"use client";

import { MobileSaveActions } from "@/components/MobileSaveActions";
import { isIosDevice } from "@/lib/html-payload";
import { useIframeHtml } from "@/lib/use-iframe-html";

type PreviewFrameProps = {
  html: string | null;
  title?: string;
  loading?: boolean;
  revision?: number;
  isTelegram?: boolean;
  onOpenFullscreen?: (html: string) => void;
};

const PREVIEW_BOX =
  "preview-shell flex w-full flex-col gap-2";

export function PreviewFrame({
  html,
  title = "moe-prilozhenie",
  loading,
  revision = 0,
  isTelegram = false,
  onOpenFullscreen,
}: PreviewFrameProps) {
  const isIos = isIosDevice();
  const iframeRef = useIframeHtml({
    html: loading ? null : html,
    revision,
    telegramMode: isTelegram,
  });

  const frameShell = (frame: React.ReactNode) => (
    <div className={PREVIEW_BOX}>
      {html && (
        <div className="hidden lg:block">
          <MobileSaveActions
            html={html}
            title={title}
            isTelegram={isTelegram}
            onOpenFullscreen={onOpenFullscreen}
          />
        </div>
      )}
      {!isTelegram && !isIos && (
        <p className="hidden px-1 text-center text-[11px] text-white/45 sm:block lg:hidden">
          Кнопки сохранения — внизу экрана
        </p>
      )}
      <div className="relative min-h-0 flex-1">{frame}</div>
    </div>
  );

  if (loading && html) {
    return frameShell(
      <>
        <iframe
          ref={iframeRef}
          title="Превью приложения"
          className="h-full w-full rounded-xl border border-white/10 bg-white opacity-40 sm:rounded-2xl"
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/40 backdrop-blur-sm sm:rounded-2xl">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
          <p className="mt-3 text-sm text-violet-200">Обновляем превью…</p>
        </div>
      </>,
    );
  }

  if (loading) {
    return (
      <div
        className={`${PREVIEW_BOX} items-center justify-center gap-4 rounded-xl border border-violet-500/20 bg-violet-950/20 sm:rounded-2xl`}
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
        <p className="text-sm text-violet-200">Генерируем вашу штуку…</p>
        <p className="text-xs text-violet-300/60">Обычно 15–30 секунд</p>
      </div>
    );
  }

  if (!html) {
    return (
      <div
        className={`${PREVIEW_BOX} items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-center sm:rounded-2xl sm:p-8`}
      >
        <span className="text-3xl sm:text-4xl">✨</span>
        <p className="text-base font-medium text-white/80 sm:text-lg">
          Здесь появится ваше приложение
        </p>
        <p className="max-w-sm text-sm text-white/50">
          Выберите шаблон или опиши идею
        </p>
      </div>
    );
  }

  return frameShell(
    <iframe
      key={revision}
      ref={iframeRef}
      title="Превью приложения"
      className="h-full w-full rounded-xl border border-white/15 bg-white shadow-xl shadow-violet-500/10 ring-1 ring-white/10 sm:rounded-2xl sm:shadow-2xl"
    />,
  );
}
