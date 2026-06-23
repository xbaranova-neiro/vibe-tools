"use client";

type EditorToolbarProps = {
  onBack: () => void;
  onNew: () => void;
  saved?: boolean;
  isTelegram?: boolean;
  onOpenFullscreen?: (html: string) => void;
  html?: string | null;
};

export function EditorToolbar({
  onBack,
  onNew,
  saved = true,
  isTelegram = false,
  onOpenFullscreen,
  html,
}: EditorToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <button
        type="button"
        onClick={onBack}
        className="touch-target rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
      >
        ← Мои приложения
      </button>
      {isTelegram && html && onOpenFullscreen && (
        <button
          type="button"
          onClick={() => onOpenFullscreen(html)}
          className="touch-target rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25"
        >
          ▶ На весь экран
        </button>
      )}
      <button
        type="button"
        onClick={onNew}
        className="touch-target rounded-xl border border-violet-400/40 bg-violet-500/20 px-4 py-2 text-sm font-semibold text-violet-50 transition hover:bg-violet-500/30"
      >
        ✨ Новое
      </button>
      {saved && (
        <span className="hidden text-xs text-emerald-400/80 sm:inline">
          ✓ сохранено
        </span>
      )}
    </div>
  );
}
