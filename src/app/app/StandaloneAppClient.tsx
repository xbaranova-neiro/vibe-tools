"use client";

import { useEffect, useState } from "react";

import { decodeHtmlPayload } from "@/lib/html-payload";
import { IFRAME_SANDBOX } from "@/lib/telegram-env";

export default function StandaloneAppClient() {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hintOpen, setHintOpen] = useState(true);

  useEffect(() => {
    const load = async () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        setError("Приложение не найдено. Создайте его на главной странице Vibe Tools.");
        return;
      }

      const decoded = await decodeHtmlPayload(hash);
      if (!decoded) {
        setError("Не удалось загрузить приложение. Ссылка повреждена или слишком длинная.");
        return;
      }

      setHtml(decoded);
    };

    void load();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#07070f] p-6 text-center text-white">
        <span className="text-4xl">⚠️</span>
        <p className="max-w-sm text-sm text-white/70">{error}</p>
        <a
          href="/"
          className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white"
        >
          ← На главную
        </a>
      </div>
    );
  }

  if (!html) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07070f]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
      </div>
    );
  }

  const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 flex flex-col bg-white">
      {hintOpen && isIos && (
        <div className="absolute inset-x-3 top-[max(12px,env(safe-area-inset-top))] z-50 rounded-2xl border border-violet-400/30 bg-[#0d0d18]/95 p-4 text-white shadow-2xl backdrop-blur-md">
          <p className="text-sm font-semibold text-violet-100">📱 На экран «Домой»</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs leading-relaxed text-white/75">
            <li>Нажмите кнопку «Поделиться» внизу Safari (квадрат со стрелкой)</li>
            <li>Выберите «На экран «Домой»»</li>
            <li>Нажмите «Добавить»</li>
          </ol>
          <p className="mt-2 text-[11px] text-white/50">
            Так работает только с этой страницей в Safari, не с файлом из «Файлов».
          </p>
          <button
            type="button"
            onClick={() => setHintOpen(false)}
            className="mt-3 w-full rounded-xl bg-violet-500 py-2.5 text-sm font-semibold"
          >
            Понятно, пользоваться
          </button>
        </div>
      )}

      <iframe
        title="Приложение"
        srcDoc={html}
        sandbox={IFRAME_SANDBOX}
        className="h-full w-full flex-1 border-0"
      />
    </div>
  );
}
