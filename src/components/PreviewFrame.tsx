"use client";

import { useEffect, useRef } from "react";

type PreviewFrameProps = {
  html: string | null;
  loading?: boolean;
  revision?: number;
};

export function PreviewFrame({ html, loading, revision = 0 }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!html || !iframeRef.current) return;
    iframeRef.current.srcdoc = html;
  }, [html, revision]);

  if (loading && html) {
    return (
      <div className="relative h-full min-h-[420px]">
        <iframe
          key={revision}
          ref={iframeRef}
          srcDoc={html}
          title="Превью приложения"
          sandbox="allow-scripts allow-same-origin"
          className="h-full min-h-[420px] w-full rounded-2xl border border-white/10 bg-white opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm pointer-events-none">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
          <p className="mt-3 text-sm text-violet-200">Обновляем превью…</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 rounded-2xl border border-violet-500/20 bg-violet-950/20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
        <p className="text-sm text-violet-200">Генерируем вашу штуку…</p>
        <p className="text-xs text-violet-300/60">Обычно 15–30 секунд</p>
      </div>
    );
  }

  if (!html) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
        <span className="text-4xl">✨</span>
        <p className="text-lg font-medium text-white/80">
          Здесь появится ваше приложение
        </p>
        <p className="max-w-sm text-sm text-white/50">
          Выберите шаблон или опишите идею — калькулятор, трекер, список
        </p>
      </div>
    );
  }

  return (
    <iframe
      key={revision}
      ref={iframeRef}
      srcDoc={html}
      title="Превью приложения"
      sandbox="allow-scripts allow-same-origin"
      className="h-full min-h-[420px] w-full rounded-2xl border border-white/15 bg-white shadow-2xl shadow-violet-500/10 ring-1 ring-white/10"
    />
  );
}
