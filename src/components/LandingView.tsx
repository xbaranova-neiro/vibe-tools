"use client";

import { TemplateCards } from "@/components/TemplateCards";
import type { Template } from "@/lib/templates";

const STEPS = [
  { n: "1", title: "Выбери шаблон", desc: "или опиши идею" },
  { n: "2", title: "Смотри генерацию", desc: "код пишется на глазах" },
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
    <div className="landing-page mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
      {isTelegram && (
        <div className="landing-fade mb-6 flex flex-col gap-3 rounded-2xl border border-violet-400/25 bg-violet-500/10 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-100">
              Вы в Telegram — шаблоны работают прямо здесь
            </p>
            <p className="mt-0.5 text-xs text-violet-200/70">
              Чтобы сохранить HTML в Файлы — откройте сайт в Safari или Chrome
            </p>
          </div>
          {onOpenExternal && (
            <button
              type="button"
              onClick={onOpenExternal}
              className="shrink-0 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white"
            >
              🌐 Открыть в браузере
            </button>
          )}
        </div>
      )}
      <nav className="landing-fade mb-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg shadow-lg shadow-violet-500/30">
            ✨
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Vibe Tools
          </span>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/50">
          без регистрации
        </span>
      </nav>

      <header className="landing-hero mb-14 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="landing-fade text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
            </span>
            Вайб-кодинг на практике
          </div>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
            Опиши — и он
            <span className="mt-1 block text-shimmer">сам это создаст</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/55 sm:text-lg lg:mx-0">
            Выбери шаблон или напиши идею. Увидишь, как мини-приложение
            собирается прямо на глазах — с кнопками, анимациями и памятью в
            браузере.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
            {["7 шаблонов", "HTML за секунды", "можно скачать"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/45"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className="landing-fade landing-fade-delay-1 relative mx-auto w-full max-w-sm lg:max-w-none"
          aria-hidden
        >
          <div className="landing-mock absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-500/20 via-transparent to-fuchsia-500/15 blur-2xl" />
          <div className="landing-mock-card relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d18]/90 shadow-2xl shadow-violet-500/10 backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/90" />
              <span className="ml-2 font-mono text-xs text-white/35">
                app.html
              </span>
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
        className="landing-fade landing-fade-delay-2 mb-12 grid gap-3 sm:grid-cols-3"
        aria-label="Как это работает"
      >
        {STEPS.map((step) => (
          <div
            key={step.n}
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-center sm:text-left"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-sm font-bold text-violet-200">
              {step.n}
            </span>
            <p className="mt-2 text-sm font-semibold text-white">{step.title}</p>
            <p className="mt-0.5 text-xs text-white/45">{step.desc}</p>
          </div>
        ))}
      </section>

      <section className="landing-fade landing-fade-delay-3 mb-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-white">Что создаём?</h2>
            <p className="mt-1 text-sm text-white/45">
              Нажми на шаблон — приложение соберётся само
            </p>
          </div>
          <span className="text-xs text-white/30">7 готовых идей</span>
        </div>
        <TemplateCards
          onSelect={onTemplate}
          disabled={false}
          selectedId={selectedId}
        />
      </section>

      <section className="landing-fade landing-fade-delay-4">
        <div className="landing-prompt-glow relative rounded-2xl p-[1px]">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c16]/80 p-6 backdrop-blur-md sm:p-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-violet-500/20 text-xl">
                💬
              </span>
              <div>
                <label
                  htmlFor="prompt"
                  className="block text-base font-semibold text-white"
                >
                  Или своими словами
                </label>
                <p className="text-xs text-white/45">
                  Любая бытовая идея — трекер, список, калькулятор
                </p>
              </div>
            </div>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              rows={3}
              placeholder="Например: трекер чтения — книга, страницы, прогресс-бар…"
              className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-white placeholder:text-white/25 outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20"
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
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01] hover:shadow-violet-500/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto sm:min-w-[200px] sm:px-10"
            >
              ✨ Создать с нуля
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
