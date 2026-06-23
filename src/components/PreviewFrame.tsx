"use client";

import { useEffect, useRef } from "react";

import {
  openHtmlInNewTab,
  prepareHtmlForPreview,
  saveHtmlToDevice,
} from "@/lib/prepare-html-for-preview";

type PreviewFrameProps = {
  html: string | null;
  title?: string;
  loading?: boolean;
  revision?: number;
};

const IFRAME_SANDBOX =
  "allow-scripts allow-same-origin allow-forms allow-storage-access-by-user-activation";

export function PreviewFrame({
  html,
  title = "moe-prilozhenie",
  loading,
  revision = 0,
}: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!html || !iframe) return;

    const prepared = prepareHtmlForPreview(html);

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
  }, [html, revision]);

  const openFullscreen = () => {
    if (!html) return;
    openHtmlInNewTab(html, { includeSaveBar: true });
  };

  const saveToPhone = () => {
    if (!html) return;
    void saveHtmlToDevice(html, title);
  };

  const frameShell = (frame: React.ReactNode) => (
    <div className="flex h-[min(75vh,640px)] min-h-[460px] w-full flex-col gap-2">
      {html && (
        <div className="flex flex-col gap-2 px-1">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={saveToPhone}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2.5 text-sm font-semibold text-white shadow-md"
            >
              💾 Сохранить
            </button>
            <button
              type="button"
              onClick={openFullscreen}
              className="rounded-xl border border-violet-400/40 bg-violet-500/20 px-3 py-2.5 text-sm font-semibold text-violet-50"
            >
              ↗ Открыть
            </button>
          </div>
          <p className="text-center text-[11px] text-white/45">
            «Сохранить» → Файлы на телефоне · работает офлайн
          </p>
        </div>
      )}
      <div className="relative min-h-0 flex-1">{frame}</div>
    </div>
  );

  if (loading && html) {
    return frameShell(
      <>
        <iframe
          key={revision}
          ref={iframeRef}
          title="Превью приложения"
          sandbox={IFRAME_SANDBOX}
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
      key={revision}
      ref={iframeRef}
      title="Превью приложения"
      sandbox={IFRAME_SANDBOX}
      className="h-full w-full rounded-2xl border border-white/15 bg-white shadow-2xl shadow-violet-500/10 ring-1 ring-white/10"
    />,
  );
}
