/** Сообщение, когда браузер не достучался до API (часто без VPN + Vercel). */
export function networkErrorMessage(): string {
  const mirror = process.env.NEXT_PUBLIC_TIMEWEB_URL?.trim();
  const onVercel =
    typeof window !== "undefined" &&
    /vercel\.app$/i.test(window.location.hostname);

  if (onVercel) {
    return mirror
      ? `Сервер не ответил — без VPN Vercel часто недоступен из России. Попробуйте шаблон (он без AI) или откройте версию на Timeweb: ${mirror}`
      : "Сервер не ответил — без VPN Vercel часто недоступен из России. Выберите готовый шаблон (работает без AI) или включите VPN.";
  }

  return "Сервер не ответил. Проверьте интернет или попробуйте готовый шаблон — он собирается мгновенно.";
}

export function isLikelyNetworkError(err: unknown): boolean {
  if (err instanceof TypeError) return true;
  const msg = err instanceof Error ? err.message : String(err);
  return /failed to fetch|networkerror|load failed|network request failed/i.test(
    msg,
  );
}
