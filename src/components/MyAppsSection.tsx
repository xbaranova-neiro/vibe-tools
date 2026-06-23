"use client";

import { useEffect, useState } from "react";

import {
  formatAppDate,
  listSavedApps,
  type SavedAppIndex,
} from "@/lib/app-library";

type MyAppsSectionProps = {
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  refreshKey?: number;
};

export function MyAppsSection({
  onOpen,
  onDelete,
  refreshKey = 0,
}: MyAppsSectionProps) {
  const [apps, setApps] = useState<SavedAppIndex[]>(() => listSavedApps());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync read from localStorage on refreshKey change
    setApps(() => listSavedApps());
  }, [refreshKey]);

  if (!apps.length) return null;

  return (
    <section className="landing-fade mb-8 sm:mb-10">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2 sm:mb-4">
        <div>
          <h2 className="text-base font-semibold text-white sm:text-lg">
            Мои приложения
          </h2>
          <p className="mt-0.5 text-xs text-white/45 sm:mt-1 sm:text-sm">
            Всё сохраняется в этом браузере — откройте и пользуйтесь
          </p>
        </div>
        <span className="text-[10px] text-white/30 sm:text-xs">
          {apps.length} шт.
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} onOpen={onOpen} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}

function AppCard({
  app,
  onOpen,
  onDelete,
}: {
  app: SavedAppIndex;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="group relative flex min-h-[108px] flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-3 sm:min-h-[120px] sm:rounded-2xl sm:p-4">
      <button
        type="button"
        onClick={() => onOpen(app.id)}
        className="flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-lg sm:h-10 sm:w-10 sm:rounded-xl sm:text-xl">
          {app.emoji}
        </div>
        <p className="mt-2 line-clamp-2 text-xs font-semibold leading-snug text-white sm:text-sm">
          {app.title}
        </p>
        <p className="mt-auto pt-2 text-[10px] text-white/40">
          {formatAppDate(app.updatedAt)}
        </p>
      </button>
      <button
        type="button"
        aria-label="Удалить"
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`Удалить «${app.title}»?`)) onDelete(app.id);
        }}
        className="absolute right-2 top-2 rounded-lg px-2 py-1 text-xs text-white/30 opacity-0 transition hover:bg-red-500/20 hover:text-red-300 group-hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
