"use client";

import { useServerHealth } from "@/lib/use-server-health";

const TIMEWEB_URL = process.env.NEXT_PUBLIC_TIMEWEB_URL?.trim();

export function ServerStatusBanner() {
  const { health, loading, aiAvailable } = useServerHealth();
  const onVercel =
    typeof window !== "undefined" &&
    /vercel\.app$/i.test(window.location.hostname);

  if (loading) return null;

  if (!health.ok) {
    return (
      <div className="landing-fade mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3.5 sm:mb-6">
        <p className="text-sm font-medium text-red-200">Сервер недоступен</p>
        <p className="mt-1 text-xs leading-relaxed text-red-200/80">
          {onVercel
            ? TIMEWEB_URL
              ? `Сайт на Vercel без VPN часто не открывается. Откройте ${TIMEWEB_URL} или выберите шаблон ниже, если страница уже загрузилась.`
              : "Без VPN Vercel может быть заблокирован. Выберите готовый шаблон — он работает без AI."
            : "Нет связи с сервером. Проверьте интернет."}
        </p>
      </div>
    );
  }

  if (!aiAvailable) {
    return (
      <div className="landing-fade mb-5 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3.5 sm:mb-6">
        <p className="text-sm font-medium text-amber-100">
          AI временно недоступен — шаблоны работают
        </p>
        <p className="mt-1 text-xs leading-relaxed text-amber-200/80">
          {!health.openai
            ? "На сервере не задан OPENAI_API_KEY. Добавьте ключ в настройках хостинга."
            : onVercel
              ? "OpenAI с Vercel без VPN часто не отвечает. Используйте шаблоны или перенесите сайт на Timeweb."
              : "Сервер не достучался до OpenAI. Проверьте ключ или задайте OPENAI_BASE_URL (прокси)."}
          {TIMEWEB_URL && onVercel ? (
            <>
              {" "}
              <a href={TIMEWEB_URL} className="font-semibold text-amber-50 underline">
                Открыть Timeweb
              </a>
            </>
          ) : null}
        </p>
      </div>
    );
  }

  if (onVercel && TIMEWEB_URL) {
    return (
      <div className="landing-fade mb-5 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3.5 sm:mb-6">
        <p className="text-xs text-violet-200/85">
          Для стабильной работы без VPN сохраните закладку:{" "}
          <a href={TIMEWEB_URL} className="font-semibold text-violet-100 underline">
            версия на Timeweb
          </a>
        </p>
      </div>
    );
  }

  return null;
}
