"use client";

import { useEffect, useMemo, useRef } from "react";

import { MobileSaveActions } from "@/components/MobileSaveActions";
import { isIosDevice } from "@/lib/html-payload";
import { prepareHtmlForPreview } from "@/lib/prepare-html-for-preview";
import { IFRAME_SANDBOX } from "@/lib/telegram-env";

type PreviewFrameProps = {
  html: string | null;
  title?: string;
  loading?: boolean;
  revision?: number;
  useSrcDoc?: boolean;
  isTelegram?: boolean;
  onOpenFullscreen?: (html: string) => void;
  onOpenExternal?: () => void;
};

export function PreviewFrame({
  html,
  title = "moe-prilozhenie",
  loading,
  revision = 0,
  useSrcDoc = false,
  isTelegram = false,
  onOpenFullscreen,
  onOpenExternal,
}: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const blobUrlRef = useRef<string | null>(null);
  const isIos = isIosDevice();

  const prepared = useMemo(
    () => (html ? prepareHtmlForPreview(html) : null),
    [html, revision],
  );

  useEffect(() => {
    if (useSrcDoc) return;

    const iframe = iframeRef.current;
    if (!prepared || !iframe) return;

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    const blob = new Blob([prepared], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    blobUrlRef.current = url;
    iframe.removeAttribute("srcdoc");
    iframe.src = url;

    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [prepared, useSrcDoc]);

  const frameShell = (frame: React.ReactNode) => (
    <div className="flex h-[min(75vh,640px)] min-h-[460px] w-full flex-col gap-2">
      {html && (
        <MobileSaveActions
          html={html}
          title={title}
          isTelegram={isTelegram}
          onOpenFullscreen={onOpenFullscreen}
          onOpenExternal={onOpenExternal}
          compact
        />
      )}
      {!isTelegram && !isIos && (
        <p className="px-1 text-center text-[11px] text-white/45">
          «Сохранить» → Файлы · работает офлайн
        </p>
      )}
      <div className="relative min-h-0 flex-1">{frame}</div>
    </div>
  );

  const iframeProps = {
    key: revision,
    ref: iframeRef,
    title: "Превью приложения",
    sandbox: IFRAME_SANDBOX,
    ...(useSrcDoc && prepared ? { srcDoc: prepared } : {}),
  };

  if (loading && html) {
    return frameShell(
      <>
        <iframe
          {...iframeProps}
          className="h-full w-full rounded-2xl border border-white/10 bg-white opacity-40"
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
          <p className="mt-3 text-sm text-violet-200">Обновляем превью…</p>
        </div>
      </>,
    );
  }

  if (loading) {
    return (
      <div className="flex h-[min(75vh,640px)] min-h-[460px] flex-col items-center justify-center gap-4 rounded-2xl border border-violet-500/20 bg-violet-950/20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
        <p className="text-sm text-violet-200">Генерируем вашу штуку…</p>
        <p className="text-xs text-violet-300/60">Обычно 15–30 секунд</p>
      </div>
    );
  }

  if (!html) {
    return (
      <div className="flex h-[min(75vh,640px)] min-h-[460px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
        <span className="text-4xl">✨</span>
        <p className="text-lg font-medium text-white/80">
          Здесь появится ваше приложение
        </p>
        <p className="max-w-sm text-sm text-white/50">
          Выберите шаблон или опиши идею — калькулятор, трекер, список
        </p>
      </div>
    );
  }

  return frameShell(
    <iframe
      {...iframeProps}
      className="h-full w-full rounded-2xl border border-white/15 bg-white shadow-2xl shadow-violet-500/10 ring-1 ring-white/10"
    />,
  );
}
