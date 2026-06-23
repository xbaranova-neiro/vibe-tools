/** Ясная команда на изменение HTML — идём в полную генерацию. */
export function isClearRefineRequest(message: string): boolean {
  const t = message.trim();
  if (t.length < 3) return false;

  if (/^(как|что|можно\s+ли|зачем|почему|где|куда|когда|сколько|explain|how|what|why)\b/i.test(t)) {
    return false;
  }

  if (/^(привет|здравств|спасибо|благодар|окей|ок$|понятно|hello|hi)\b/i.test(t)) {
    return false;
  }

  const refineVerbs =
    /\b(добав\w*|убери\w*|удали\w*|измени\w*|сделай\w*|исправ\w*|поменя\w*|передел\w*|увелич\w*|уменьш\w*|замени\w*|встав\w*|скрой\w*|покажи\w*|укрупн\w*|потемн\w*|посветл\w*|перенес\w*|перестав\w*|убрать|добавить|изменить|исправить)\b/i;

  const refineTargets =
    /\b(тем\w*|кнопк\w*|фон\w*|шрифт\w*|анимац\w*|график\w*|иконк\w*|список\w*|пол\w*|форм\w*|цвет\w*|стил\w*|размер\w*|отступ\w*|прогресс\w*|счётчик\w*|назван\w*|текст\w*)\b/i;

  if (refineVerbs.test(t)) return true;
  if (refineTargets.test(t) && t.length >= 12) return true;

  return false;
}

export function extractAppHint(html: string): string {
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim();
  const parts = [title, h1].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "мини-приложение";
}
