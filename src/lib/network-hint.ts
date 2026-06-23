/** Сообщение, когда браузер не достучался до API. */
export function networkErrorMessage(): string {
  const mirror = process.env.NEXT_PUBLIC_TIMEWEB_URL?.trim();

  if (mirror) {
    return `Не удалось связаться с сервером. Попробуйте готовый шаблон или откройте ${mirror}`;
  }

  return "Не удалось связаться с сервером. Проверьте интернет или выберите готовый шаблон — он открывается сразу.";
}

export function isLikelyNetworkError(err: unknown): boolean {
  if (err instanceof TypeError) return true;
  const msg = err instanceof Error ? err.message : String(err);
  return /failed to fetch|networkerror|load failed|network request failed|unexpected token|is not valid json/i.test(
    msg,
  );
}

/** Сообщение при неверном ответе сервера (HTML вместо JSON). */
export function vercelOrParseErrorMessage(): string {
  return networkErrorMessage().replace(
    "Не удалось связаться с сервером",
    "Сервер вернул ошибку",
  );
}
