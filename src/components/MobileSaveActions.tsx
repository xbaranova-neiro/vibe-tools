"use client";

import { useState } from "react";

import {
  openForHomeScreen,
  openAppInBrowser,
  isIosDevice,
  type HomeScreenResult,
} from "@/lib/html-payload";
import { saveHtmlToDevice } from "@/lib/prepare-html-for-preview";

type MobileSaveActionsProps = {
  html: string;
  title: string;
  isTelegram?: boolean;
  onOpenFullscreen?: (html: string) => void;
  onOpenExternal?: () => void;
  compact?: boolean;
};

export function MobileSaveActions({
  html,
  title,
  isTelegram = false,
  onOpenFullscreen,
  onOpenExternal,
}: MobileSaveActionsProps) {
  const [busy, setBusy] = useState(false);
  const isIos = isIosDevice();

  const handleHomeScreen = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result: HomeScreenResult = await openForHomeScreen(html);
      if (result === "too-large") {
        alert(
          "Приложение слишком большое. Попробуйте шаблон или сохраните в Файлы.",
        );
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSaveFile = () => {
    if (isTelegram) {
      void openAppInBrowser(html);
      return;
    }
    void saveHtmlToDevice(html, title);
  };

  const handleOpen = () => {
    if (isTelegram && onOpenFullscreen) {
      onOpenFullscreen(html);
      return;
    }
    void openAppInBrowser(html);
  };

  const homeButton = (
    <button
      type="button"
      onClick={() => void handleHomeScreen()}
      disabled={busy}
      className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 disabled:opacity-60"
    >
      {busy ? "…" : "📱 На экран «Домой»"}
    </button>
  );

  if (isIos) {
    return (
      <div className="flex flex-col gap-2">
        {homeButton}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleSaveFile}
            className="rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-semibold text-white/90"
          >
            {isTelegram ? "🌐 Safari" : "💾 В Файлы"}
          </button>
          <button
            type="button"
            onClick={handleOpen}
            className="rounded-xl border border-violet-400/40 bg-violet-500/20 py-2.5 text-sm font-semibold text-violet-50"
          >
            {isTelegram ? "▶ В чате" : "↗ Открыть"}
          </button>
        </div>
        <p className="text-center text-[11px] text-white/45">
          {isTelegram
            ? "«Домой» откроет Safari → Поделиться → Добавить"
            : "Safari → Поделиться → На экран «Домой»"}
        </p>
      </div>
    );
  }

  if (isTelegram) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleSaveFile}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-semibold text-white"
        >
          🌐 Safari
        </button>
        <button
          type="button"
          onClick={handleOpen}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-sm font-semibold text-white"
        >
          ▶ В чате
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={handleSaveFile}
        className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-semibold text-white"
      >
        💾 Сохранить
      </button>
      <button
        type="button"
        onClick={handleOpen}
        className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-sm font-semibold text-white"
      >
        ↗ Открыть
      </button>
    </div>
  );
}
