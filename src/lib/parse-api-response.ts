function mirrorUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_TIMEWEB_URL?.trim() || undefined;
}

function serverFailureMessage(status: number): string {
  const mirror = mirrorUrl();
  if (status === 504 || status === 502) {
    return mirror
      ? `Запрос занял слишком долго. Выберите шаблон — он открывается сразу · ${mirror}`
      : "Запрос занял слишком долго. Выберите готовый шаблон — он открывается сразу.";
  }
  return mirror
    ? `Создание с нуля сейчас недоступно. Шаблоны работают сразу · ${mirror}`
    : "Создание с нуля сейчас недоступно. Выберите готовый шаблон — он открывается сразу.";
}

/** Безопасный разбор ответа API — иногда приходит HTML вместо JSON. */
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
        : serverFailureMessage(res.status),
    };
  }

  try {
    const data = JSON.parse(trimmed) as T;
    if (!res.ok) {
      const errBody = data as { error?: string };
      return {
        data: null,
        error: errBody.error ?? serverFailureMessage(res.status),
      };
    }
    return { data, error: "" };
  } catch {
    const looksLikeHtml =
      trimmed.startsWith("<!") ||
      trimmed.startsWith("<html") ||
      trimmed.includes("<!DOCTYPE");
    const looksLikePlainError =
      /^An error/i.test(trimmed) || /^Internal Server Error/i.test(trimmed);

    if (looksLikeHtml || looksLikePlainError) {
      return { data: null, error: serverFailureMessage(res.status) };
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
