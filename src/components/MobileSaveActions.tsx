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

  const btnPrimary =
    "touch-target w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 disabled:opacity-60";
  const btnSecondary =
    "touch-target rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white/90 active:bg-white/10";
  const btnGhost =
    "touch-target rounded-xl border border-violet-400/40 bg-violet-500/20 py-3 text-sm font-semibold text-violet-50 active:bg-violet-500/30";

  if (isIos) {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => void handleHomeScreen()}
          disabled={busy}
          className={btnPrimary}
        >
          {busy ? "…" : "📱 На экран «Домой»"}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={handleSaveFile} className={btnSecondary}>
            {isTelegram ? "🌐 Safari" : "💾 В Файлы"}
          </button>
          <button type="button" onClick={handleOpen} className={btnGhost}>
            {isTelegram ? "▶ В чате" : "↗ Открыть"}
          </button>
        </div>
      </div>
    );
  }

  if (isTelegram) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleSaveFile}
          className="touch-target rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-semibold text-white"
        >
          🌐 Safari
        </button>
        <button
          type="button"
          onClick={handleOpen}
          className="touch-target rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-sm font-semibold text-white"
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
        className="touch-target rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-semibold text-white"
      >
        💾 Сохранить
      </button>
      <button
        type="button"
        onClick={handleOpen}
        className="touch-target rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-sm font-semibold text-white"
      >
        ↗ Открыть
      </button>
    </div>
  );
}
