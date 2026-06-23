"use client";

import { useEffect, useState } from "react";

const TIMEWEB_URL = process.env.NEXT_PUBLIC_TIMEWEB_URL?.trim();

export function ServerStatusBanner() {
  const [status, setStatus] = useState<"checking" | "ok" | "fail">("checking");
  const onVercel =
    typeof window !== "undefined" &&
    /vercel\.app$/i.test(window.location.hostname);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);

    fetch("/api/health", { signal: ctrl.signal })
      .then((r) => {
        if (cancelled) return;
        setStatus(r.ok ? "ok" : "fail");
      })
      .catch(() => {
        if (!cancelled) setStatus("fail");
      })
      .finally(() => clearTimeout(timer));

    return () => {
      cancelled = true;
      ctrl.abort();
      clearTimeout(timer);
    };
  }, []);

  if (status === "checking" || status === "ok") {
    if (!onVercel || !TIMEWEB_URL) return null;
    return (
      <div className="landing-fade mb-5 rounded-2xl border border-amber-400/25 bg-amber-500/10 px-4 py-3.5 sm:mb-6">
        <p className="text-sm font-medium text-amber-100">
          Vercel без VPN из РФ часто не отвечает
        </p>
        <p className="mt-1 text-xs leading-relaxed text-amber-200/80">
          Шаблоны работают сразу. Для своих идей и доработок лучше{" "}
          <a
            href={TIMEWEB_URL}
            className="font-semibold text-amber-50 underline underline-offset-2"
          >
            открыть версию на Timeweb
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="landing-fade mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3.5 sm:mb-6">
      <p className="text-sm font-medium text-red-200">Сервер недоступен</p>
      <p className="mt-1 text-xs leading-relaxed text-red-200/80">
        {onVercel
          ? TIMEWEB_URL
            ? `Без VPN Vercel может быть заблокирован. Попробуйте шаблон ниже или откройте ${TIMEWEB_URL}`
            : "Без VPN Vercel может быть заблокирован. Попробуйте готовый шаблон — он не требует AI."
          : "Проверьте интернет. Шаблоны могут работать, если страница уже загрузилась."}
      </p>
    </div>
  );
}
