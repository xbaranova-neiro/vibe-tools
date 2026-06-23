"use client";

import { TemplateCards } from "@/components/TemplateCards";
import type { Template } from "@/lib/templates";

const STEPS = [
  { n: "1", title: "Выбери шаблон", desc: "или опиши идею" },
  { n: "2", title: "Смотри генерацию", desc: "код на глазах" },
  { n: "3", title: "Пользуйся", desc: "сразу в превью" },
];

type LandingViewProps = {
  prompt: string;
  onPromptChange: (value: string) => void;
  onCreate: () => void;
  onTemplate: (template: Template) => void;
  selectedId?: string | null;
  error?: string | null;
  isTelegram?: boolean;
  onOpenExternal?: () => void;
};

export function LandingView({
  prompt,
  onPromptChange,
  onCreate,
  onTemplate,
  selectedId,
  error,
  isTelegram = false,
  onOpenExternal,
}: LandingViewProps) {
  return (
    <div className="landing-page safe-x mx-auto w-full max-w-5xl px-3 pb-20 pt-4 sm:px-6 sm:pb-16 sm:pt-8">
      {isTelegram && (
        <div className="landing-fade mb-5 flex flex-col gap-3 rounded-2xl border border-violet-400/25 bg-violet-500/10 px-4 py-3.5 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-violet-100">
              Вы в Telegram — шаблоны работают здесь
            </p>
            <p className="mt-0.5 text-xs text-violet-200/70">
              Для «На экран Домой» — откройте в Safari
            </p>
          </div>
          {onOpenExternal && (
            <button
              type="button"
              onClick={onOpenExternal}
              className="touch-target shrink-0 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white"
            >
              🌐 Safari
            </button>
          )}
        </div>
      )}

      <nav className="landing-fade mb-6 flex items-center justify-between gap-2 sm:mb-10">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-base shadow-lg shadow-violet-500/30 sm:h-9 sm:w-9 sm:text-lg">
            ✨
          </div>
          <span className="truncate text-base font-bold tracking-tight text-white sm:text-lg">
            Vibe Tools
          </span>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/50 sm:px-3 sm:text-xs">
          без регистрации
        </span>
      </nav>

      <header className="landing-hero mb-8 grid items-center gap-8 sm:mb-12 sm:gap-10 lg:mb-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="landing-fade text-center lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200 sm:mb-5 sm:px-4 sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
            </span>
            Вайб-кодинг на практике
          </div>
          <h1 className="text-[1.75rem] font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[3.25rem]">
            Опиши — и он
            <span className="mt-1 block text-shimmer">сам это создаст</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/55 sm:mt-5 sm:text-base lg:mx-0 lg:text-lg">
            Шаблон или своя идея — мини-приложение с кнопками, анимациями и
            памятью в браузере.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:mt-6 sm:gap-2 lg:justify-start">
            {["7 шаблонов", "HTML за секунды", "можно скачать"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/45 sm:px-3 sm:text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className="landing-fade landing-fade-delay-1 relative mx-auto hidden w-full max-w-sm sm:block lg:max-w-none"
          aria-hidden
        >
          <div className="landing-mock absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-500/20 via-transparent to-fuchsia-500/15 blur-2xl" />
          <div className="landing-mock-card relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d18]/90 shadow-2xl shadow-violet-500/10 backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/90" />
              <span className="ml-2 font-mono text-xs text-white/35">app.html</span>
            </div>
            <div className="space-y-2 p-4 font-mono text-[11px] leading-relaxed sm:text-xs">
              <p className="text-violet-300/80">
                <span className="text-fuchsia-400/90">&lt;!</span>DOCTYPE html
                <span className="text-fuchsia-400/90">&gt;</span>
              </p>
              <p className="text-emerald-400/90">
                <span className="text-white/30">··· </span>function render(){" "}
                {"{"} updateUI() {"}"}
              </p>
              <p className="text-cyan-300/80">
                <span className="text-white/30">··· </span>
                localStorage.setItem(...)
              </p>
              <p className="flex items-center gap-1 text-white/40">
                <span className="landing-cursor inline-block h-3.5 w-0.5 bg-violet-400" />
                пишет код…
              </p>
            </div>
            <div className="border-t border-white/10 bg-violet-500/10 px-4 py-2.5 text-center text-xs font-medium text-violet-200/90">
              ⚡ так выглядит генерация
            </div>
          </div>
        </div>
      </header>

      <section
        className="landing-fade landing-fade-delay-2 mb-8 grid grid-cols-3 gap-2 sm:mb-12 sm:gap-3"
        aria-label="Как это работает"
      >
        {STEPS.map((step) => (
          <div
            key={step.n}
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-2 py-2.5 sm:px-4 sm:py-4"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/20 text-[11px] font-bold text-violet-200 sm:h-7 sm:w-7 sm:text-sm">
              {step.n}
            </span>
            <p className="mt-1 text-[11px] font-semibold leading-tight text-white sm:mt-2 sm:text-sm">
              {step.title}
            </p>
            <p className="mt-0.5 hidden text-[10px] text-white/45 sm:block sm:text-xs">
              {step.desc}
            </p>
          </div>
        ))}
      </section>

      <section className="landing-fade landing-fade-delay-3 mb-8 sm:mb-10">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2 sm:mb-4">
          <div>
            <h2 className="text-base font-semibold text-white sm:text-lg">
              Что создаём?
            </h2>
            <p className="mt-0.5 text-xs text-white/45 sm:mt-1 sm:text-sm">
              Нажми на шаблон — соберётся само
            </p>
          </div>
          <span className="text-[10px] text-white/30 sm:text-xs">7 идей</span>
        </div>
        <TemplateCards
          onSelect={onTemplate}
          disabled={false}
          selectedId={selectedId}
        />
      </section>

      <section className="landing-fade landing-fade-delay-4 safe-bottom">
        <div className="landing-prompt-glow relative rounded-2xl p-[1px]">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c16]/80 p-4 backdrop-blur-md sm:p-7">
            <div className="mb-3 flex items-center gap-3 sm:mb-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-violet-500/20 text-lg sm:h-10 sm:w-10 sm:text-xl">
                💬
              </span>
              <div className="min-w-0">
                <label
                  htmlFor="prompt"
                  className="block text-sm font-semibold text-white sm:text-base"
                >
                  Или своими словами
                </label>
                <p className="text-[11px] text-white/45 sm:text-xs">
                  Трекер, список, калькулятор…
                </p>
              </div>
            </div>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              rows={3}
              placeholder="Трекер чтения — книга, страницы, прогресс…"
              className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3.5 py-3 text-base text-white placeholder:text-white/25 outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20 sm:px-4 sm:py-3.5 sm:text-sm"
            />

            {error && (
              <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={onCreate}
              disabled={!prompt.trim()}
              className="touch-target mt-4 w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 sm:mt-5 sm:w-auto sm:min-w-[200px] sm:px-10"
            >
              ✨ Создать с нуля
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
