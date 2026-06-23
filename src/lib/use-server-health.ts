"use client";

import { useEffect, useState } from "react";

import { parseApiJsonResponse } from "@/lib/parse-api-response";

export type ServerHealth = {
  ok: boolean;
  openai: boolean;
  aiReady: boolean;
  host: string | null;
};

const DEFAULT: ServerHealth = {
  ok: false,
  openai: false,
  aiReady: false,
  host: null,
};

export function useServerHealth() {
  const [health, setHealth] = useState<ServerHealth>(DEFAULT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10_000);

    fetch("/api/health", { signal: ctrl.signal, cache: "no-store" })
      .then(async (r) => {
        if (cancelled) return;
        const { data } = await parseApiJsonResponse<ServerHealth>(r);
        if (!data) {
          setHealth(DEFAULT);
          return;
        }
        setHealth({
          ok: Boolean(data.ok),
          openai: Boolean(data.openai),
          aiReady: Boolean(data.aiReady),
          host: data.host ?? null,
        });
      })
      .catch(() => {
        if (!cancelled) setHealth(DEFAULT);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
        clearTimeout(timer);
      });

    return () => {
      cancelled = true;
      ctrl.abort();
      clearTimeout(timer);
    };
  }, []);

  return { health, loading, aiAvailable: health.ok && health.aiReady };
}
