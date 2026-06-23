"use client";

import { useServerHealth } from "@/lib/use-server-health";

const MIRROR_URL = process.env.NEXT_PUBLIC_TIMEWEB_URL?.trim();

export function ServerStatusBanner() {
  const { health, loading, aiAvailable } = useServerHealth();

  if (loading) return null;

  if (!health.ok) {
    return (
      <div className="landing-fade mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3.5 sm:mb-6">
        <p className="text-sm font-medium text-red-200">Сервер недоступен</p>
        <p className="mt-1 text-xs leading-relaxed text-red-200/80">
          {MIRROR_URL
            ? `Не удалось подключиться. Попробуйте ${MIRROR_URL} или выберите шаблон ниже.`
            : "Не удалось подключиться. Проверьте интернет или выберите готовый шаблон."}
        </p>
      </div>
    );
  }

  if (!aiAvailable) {
    return (
      <div className="landing-fade mb-5 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3.5 sm:mb-6">
        <p className="text-sm font-medium text-amber-100">
          Создание с нуля временно недоступно
        </p>
        <p className="mt-1 text-xs leading-relaxed text-amber-200/80">
          Готовые шаблоны работают всегда — нажмите на любой ниже.
          {MIRROR_URL ? (
            <>
              {" "}
              <a href={MIRROR_URL} className="font-semibold text-amber-50 underline">
                Открыть запасную ссылку
              </a>
            </>
          ) : null}
        </p>
      </div>
    );
  }

  if (MIRROR_URL) {
    return (
      <div className="landing-fade mb-5 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3.5 sm:mb-6">
        <p className="text-xs text-violet-200/85">
          Если сайт тормозит — сохраните закладку:{" "}
          <a href={MIRROR_URL} className="font-semibold text-violet-100 underline">
            запасная ссылка
          </a>
        </p>
      </div>
    );
  }

  return null;
}
