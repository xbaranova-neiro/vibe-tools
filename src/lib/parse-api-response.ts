function onVercelHost(): boolean {
  return (
    typeof window !== "undefined" &&
    /vercel\.app$/i.test(window.location.hostname)
  );
}

function vercelFailureMessage(status: number): string {
  const mirror = process.env.NEXT_PUBLIC_TIMEWEB_URL?.trim();
  if (status === 504 || status === 502) {
    return mirror
      ? `Vercel оборвал запрос (таймаут). Шаблоны работают сразу, для AI — ${mirror}`
      : "Vercel оборвал запрос (лимит ~10 сек). Выберите шаблон выше — он без AI и работает сразу.";
  }
  return mirror
    ? `Генерация на Vercel недоступна. Шаблоны работают сразу · для AI: ${mirror}`
    : "Генерация на Vercel недоступна без VPN. Выберите готовый шаблон — он работает сразу.";
}

/** Безопасный разбор ответа API — Vercel часто отдаёт HTML «An error occurred…». */
export async function parseApiJsonResponse<T>(
  res: Response,
): Promise<{ data: T | null; error: string }> {
  const text = await res.text();
  const trimmed = text.trim();

  if (!trimmed) {
    return {
      data: null,
      error: res.ok
        ? "Пустой ответ сервера"
        : onVercelHost()
          ? vercelFailureMessage(res.status)
          : `Ошибка сервера (${res.status})`,
    };
  }

  try {
    const data = JSON.parse(trimmed) as T;
    if (!res.ok) {
      const errBody = data as { error?: string };
      return {
        data: null,
        error:
          errBody.error ??
          (onVercelHost()
            ? vercelFailureMessage(res.status)
            : `Ошибка сервера (${res.status})`),
      };
    }
    return { data, error: "" };
  } catch {
    const looksLikeHtml =
      trimmed.startsWith("<!") ||
      trimmed.startsWith("<html") ||
      trimmed.includes("<!DOCTYPE");
    const looksLikeVercelPlain =
      /^An error/i.test(trimmed) || /^Internal Server Error/i.test(trimmed);

    if (onVercelHost() || looksLikeHtml || looksLikeVercelPlain) {
      return { data: null, error: vercelFailureMessage(res.status) };
    }

    return {
      data: null,
      error: `Сервер вернул неверный ответ (${res.status}). Попробуйте шаблон.`,
    };
  }
}

export function isJsonParseError(err: unknown): boolean {
  if (!(err instanceof SyntaxError)) return false;
  return /json|unexpected token/i.test(err.message);
}
