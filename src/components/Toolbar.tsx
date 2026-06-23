"use client";

import { useState } from "react";

import {
  openForHomeScreen,
  openAppInBrowser,
  isIosDevice,
  type HomeScreenResult,
} from "@/lib/html-payload";
import { saveHtmlToDevice } from "@/lib/prepare-html-for-preview";

type ToolbarProps = {
  html: string | null;
  title: string;
  onReset: () => void;
  isTelegram?: boolean;
  onOpenFullscreen?: (html: string) => void;
  onOpenExternal?: () => void;
};

export function Toolbar({
  html,
  title,
  onReset,
  isTelegram = false,
  onOpenFullscreen,
}: ToolbarProps) {
  const [saving, setSaving] = useState(false);
  const [homeBusy, setHomeBusy] = useState(false);
  const isIos = isIosDevice();

  const openApp = () => {
    if (!html) return;
    if (isTelegram && onOpenFullscreen) {
      onOpenFullscreen(html);
      return;
    }
    void openAppInBrowser(html);
  };

  const saveApp = async () => {
    if (!html || saving) return;
    if (isTelegram) {
      void openAppInBrowser(html);
      return;
    }
    setSaving(true);
    try {
      await saveHtmlToDevice(html, title);
    } finally {
      setSaving(false);
    }
  };

  const addToHomeScreen = async () => {
    if (!html || homeBusy) return;
    setHomeBusy(true);
    try {
      const result: HomeScreenResult = await openForHomeScreen(html);
      if (result === "too-large") {
        alert(
          "Приложение слишком большое. Попробуйте шаблон или сохраните в Файлы.",
        );
      }
    } finally {
      setHomeBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isIos && (
        <button
          type="button"
          onClick={() => void addToHomeScreen()}
          disabled={!html || homeBusy}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {homeBusy ? "…" : "📱 "}
          <span className="hidden sm:inline">На экран «Домой»</span>
          <span className="sm:hidden">Домой</span>
        </button>
      )}
      <button
        type="button"
        onClick={() => void saveApp()}
        disabled={!html || saving}
        className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "…" : isTelegram ? "🌐 " : "💾 "}
        <span className="sm:hidden">{isTelegram ? "Safari" : "Файлы"}</span>
        <span className="hidden sm:inline">
          {isTelegram ? "Открыть в Safari" : "Сохранить в Файлы"}
        </span>
      </button>
      <button
        type="button"
        onClick={openApp}
        disabled={!html}
        className="rounded-xl border border-violet-400/40 bg-violet-500/20 px-4 py-2 text-sm font-semibold text-violet-50 transition hover:bg-violet-500/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isTelegram ? "▶ В чате" : "↗ Открыть"}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        🔄 Заново
      </button>
    </div>
  );
}
