"use client";

import { TEMPLATES, type Template } from "@/lib/templates";

const CARD_ACCENTS = [
  "from-violet-500/25 to-fuchsia-500/5",
  "from-cyan-500/25 to-blue-500/5",
  "from-emerald-500/25 to-teal-500/5",
  "from-amber-500/25 to-orange-500/5",
  "from-rose-500/25 to-pink-500/5",
  "from-indigo-500/25 to-violet-500/5",
  "from-lime-500/20 to-emerald-500/5",
];

type TemplateCardsProps = {
  onSelect: (template: Template) => void;
  disabled?: boolean;
  selectedId?: string | null;
};

export function TemplateCards({
  onSelect,
  disabled,
  selectedId,
}: TemplateCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {TEMPLATES.map((template, i) => {
        const active = selectedId === template.id;
        const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
        return (
          <button
            key={template.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(template)}
            style={{ animationDelay: `${i * 50}ms` }}
            className={`template-card group relative flex min-h-[132px] flex-col overflow-hidden rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b12] disabled:cursor-not-allowed disabled:opacity-50 ${
              active
                ? "border-violet-400/70 bg-violet-500/20 shadow-xl shadow-violet-500/20"
                : "border-white/10 bg-white/[0.04] hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-violet-500/10"
            }`}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />
            <div className="relative flex flex-1 flex-col">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-xl shadow-inner transition-transform duration-300 group-hover:scale-105">
                {template.emoji}
              </div>
              <p className="mt-3 text-sm font-semibold leading-snug text-white">
                {template.title}
              </p>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-white/45">
                {template.description}
              </p>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-violet-300/70">
                создаст сам →
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
