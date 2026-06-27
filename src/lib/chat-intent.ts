/** Есть ли в сообщении глагол/намерение изменить приложение. */
const REFINE_ACTION =
  /(добав\w*|убер\w*|удал\w*|измен\w*|сдел\w*|исправ\w*|помен\w*|передел\w*|увелич\w*|уменьш\w*|замен\w*|встав\w*|скрой\w*|покаж\w*|улучш\w*|доработ\w*|обнов\w*|почин\w*|перекрас\w*|украс\w*|укрупн\w*|потемн\w*|посветл\w*|перенес\w*|перестав\w*|убрать|добавить|изменить|исправить|fix|add|remove|change|update|make)/i;

/**
 * Только текстовый ответ без правки HTML — узкий список.
 * Всё остальное при открытом приложении → полная доработка через нейросеть.
 */
export function isChatOnlyRefineMessage(message: string): boolean {
  const t = message.trim();
  if (t.length < 3) return true;

  if (/^(привет|здравств|спасибо|благодар|понятно|hello|hi|hey|окей|ок)$/i.test(t)) {
    return true;
  }

  if (/^(как|зачем|почему|how|why)\s/i.test(t) && !REFINE_ACTION.test(t)) {
    return true;
  }

  if (/^(что такое|что значит|что умеет|что делает|what is)\s/i.test(t)) {
    return true;
  }

  if (/^(сколько|когда|где)\s/i.test(t) && !REFINE_ACTION.test(t)) {
    return true;
  }

  if (/\?\s*$/.test(t) && !REFINE_ACTION.test(t)) {
    return true;
  }

  return false;
}

/** @deprecated Используйте !isChatOnlyRefineMessage */
export function isClearRefineRequest(message: string): boolean {
  return !isChatOnlyRefineMessage(message);
}

export function extractAppHint(html: string): string {
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim();
  const parts = [title, h1].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "приложение";
}

/** Разворачивает короткий запрос «улучши» в конкретную задачу для модели. */
export function enrichRefinePrompt(message: string): string {
  const t = message.trim();
  if (/^(улучши|лучше|ещё|еще|доработай|обнови|красивее|сочнее|wow)$/i.test(t)) {
    return `${t}\n\nСделай заметные улучшения: цвета, отступы, анимации или UX — чтобы сразу была видна разница.`;
  }
  if (/^(улучши|сделай лучше|доработай)\b/i.test(t) && t.length < 40) {
    return `${t}\n\nИзмени интерфейс так, чтобы пользователь сразу увидел разницу в превью.`;
  }
  return t;
}
