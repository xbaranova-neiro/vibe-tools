"use client";

import { useState } from "react";

import {
  openForHomeScreen,
  isIosDevice,
  type HomeScreenResult,
} from "@/lib/html-payload";
import {
  openHtmlInNewTab,
  saveHtmlToDevice,
} from "@/lib/prepare-html-for-preview";

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
  compact = false,
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
          "Приложение слишком большое для ярлыка. Попробуйте шаблон или сохраните HTML в Файлы.",
        );
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSaveFile = () => {
    if (isTelegram) {
      onOpenExternal?.();
      return;
    }
    void saveHtmlToDevice(html, title);
  };

  const handleOpen = () => {
    if (isTelegram && onOpenFullscreen) {
      onOpenFullscreen(html);
      return;
    }
    openHtmlInNewTab(html, { includeSaveBar: true });
  };

  if (isTelegram) {
    return (
      <div className={compact ? "grid grid-cols-2 gap-2" : "flex gap-2"}>
        <button
          type="button"
          onClick={handleSaveFile}
          className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-semibold text-white"
        >
          🌐 Браузер
        </button>
        <button
          type="button"
          onClick={handleOpen}
          className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-sm font-semibold text-white"
        >
          ▶ Пользоваться
        </button>
      </div>
    );
  }

  if (isIos) {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => void handleHomeScreen()}
          disabled={busy}
          className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 disabled:opacity-60"
        >
          {busy ? "…" : "📱 На экран «Домой»"}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleSaveFile}
            className="rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-semibold text-white/90"
          >
            💾 В Файлы
          </button>
          <button
            type="button"
            onClick={handleOpen}
            className="rounded-xl border border-violet-400/40 bg-violet-500/20 py-2.5 text-sm font-semibold text-violet-50"
          >
            ↗ Открыть
          </button>
        </div>
        <p className="text-center text-[11px] text-white/45">
          «На экран Домой» → Safari → Поделиться → Добавить
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? "grid grid-cols-2 gap-2" : "flex gap-2"}>
      <button
        type="button"
        onClick={handleSaveFile}
        className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-semibold text-white"
      >
        💾 Сохранить
      </button>
      <button
        type="button"
        onClick={handleOpen}
        className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-sm font-semibold text-white"
      >
        ↗ Открыть
      </button>
    </div>
  );
}
