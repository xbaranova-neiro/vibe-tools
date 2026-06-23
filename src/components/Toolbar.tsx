"use client";

import { useState } from "react";

import {
  openHtmlInNewTab,
  saveHtmlToDevice,
} from "@/lib/prepare-html-for-preview";

type ToolbarProps = {
  html: string | null;
  title: string;
  onReset: () => void;
};

export function Toolbar({ html, title, onReset }: ToolbarProps) {
  const [saving, setSaving] = useState(false);

  const openApp = () => {
    if (!html) return;
    openHtmlInNewTab(html, { includeSaveBar: true });
  };

  const saveApp = async () => {
    if (!html || saving) return;
    setSaving(true);
    try {
      await saveHtmlToDevice(html, title);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => void saveApp()}
        disabled={!html || saving}
        className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? "…" : "💾 "}
        <span className="sm:hidden">Сохранить</span>
        <span className="hidden sm:inline">Сохранить HTML</span>
      </button>
      <button
        type="button"
        onClick={openApp}
        disabled={!html}
        className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ↗ Открыть
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
