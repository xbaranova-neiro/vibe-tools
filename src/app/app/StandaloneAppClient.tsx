"use client";

import { useEffect, useState } from "react";

import { decodeHtmlPayload, isIosDevice } from "@/lib/html-payload";
import { installHtmlDocument } from "@/lib/install-html-document";

type StandaloneAppClientProps = {
  pathPayload?: string;
};

export default function StandaloneAppClient({
  pathPayload,
}: StandaloneAppClientProps) {
  const [error, setError] = useState<string | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [hintOpen, setHintOpen] = useState(() => isIosDevice());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      const fromPath = pathPayload ? decodeURIComponent(pathPayload) : "";
      const fromHash = window.location.hash.slice(1);
      const raw = fromPath || fromHash;

      if (!raw) {
        setError(
          "Приложение не найдено. Создайте его на главной странице Vibe Tools.",
        );
        return;
      }

      const decoded = await decodeHtmlPayload(raw);
      if (!decoded) {
        setError(
          "Не удалось загрузить приложение. Ссылка повреждена или слишком длинная.",
        );
        return;
      }

      setHtml(decoded);
    };

    void load();
  }, [pathPayload]);

  useEffect(() => {
    if (!html || ready) return;
    if (hintOpen) return;

    try {
      installHtmlDocument(html);
      setReady(true);
    } catch {
      setError("Ошибка отображения приложения");
    }
  }, [html, hintOpen, ready]);

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

  if (hintOpen) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#07070f] p-6 text-white">
        <div className="w-full max-w-sm rounded-2xl border border-violet-400/30 bg-[#0d0d18] p-5 shadow-2xl">
          <p className="text-base font-semibold text-violet-100">
            📱 Добавить на экран «Домой»
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm leading-relaxed text-white/75">
            <li>Нажмите «Поделиться» внизу Safari (□ со стрелкой вверх)</li>
            <li>Выберите «На экран «Домой»»</li>
            <li>Нажмите «Добавить»</li>
          </ol>
          <p className="mt-3 text-xs text-white/45">
            Сначала добавьте ярлык — потом откроется приложение
          </p>
          <button
            type="button"
            onClick={() => setHintOpen(false)}
            className="mt-4 w-full rounded-xl bg-violet-500 py-3 text-sm font-semibold"
          >
            Понятно, открыть приложение
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07070f]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
      </div>
    );
  }

  return null;
}
