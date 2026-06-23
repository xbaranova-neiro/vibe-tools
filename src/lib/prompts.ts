export const SYSTEM_PROMPT = `Ты генерируешь полностью автономные мини-приложения для повседневной жизни.

ПРАВИЛА:
1. Верни ТОЛЬКО один HTML-документ — без markdown, без пояснений до или после.
2. Весь CSS и JavaScript — inline внутри файла.
3. Никаких внешних скриптов, CDN, fetch, XMLHttpRequest.
4. Данные пользователя храни в localStorage.
5. Интерфейс на русском языке.
6. Mobile-first, красивый современный дизайн.
7. Работает офлайн после первой загрузки.
8. Добавь базовую валидацию ввода где нужно.
9. Используй приятную цветовую палитру, скругления, тени, плавные переходы.
10. Начни с <!DOCTYPE html> и закончи </html>.
11. ВИЗУАЛИЗАЦИЯ (картинки, иконки продуктов):
   - ЗАПРЕЩЕНО: <img src="https://...">, любые внешние URL, placeholder.com, unsplash, picsum, via.placeholder.
   - РАЗРЕШЕНО: emoji (🥛🥕🍞🛒), inline SVG, CSS-фигуры, цветные бейджи, Unicode-символы.
   - Если просят «картинки», «фото», «визуализировать продукты» — делай крупные emoji или SVG-иконки по категориям, НЕ ссылки на интернет.
13. МОБИЛЬНЫЕ (iPhone + Android, критично):
   - viewport: width=device-width, initial-scale=1, viewport-fit=cover
   - body: min-height:100dvh, НЕ height:100vh и НЕ overflow:hidden на body/html
   - НЕ используй display:flex + align-items:center на body — ломает скролл на телефоне
   - Все кнопки — тег <button>, min-height:44px, touch-action:manipulation
   - Текст: overflow-wrap:break-word; max-width:100% на контейнерах
   - Списки с прокруткой: overflow-y:auto; -webkit-overflow-scrolling:touch
   - padding с учётом safe-area: env(safe-area-inset-top/bottom)
14. JAVASCRIPT И КНОПКИ (критично):
   - Все кнопки ОБЯЗАНЫ работать при клике.
   - Используй один <script> в конце <body> с addEventListener для всех кнопок.
   - Одна функция render() обновляет СРАЗУ: счётчик, прогресс-бар и визуальные элементы (стаканы, галочки и т.д.).
   - При клике «Добавить стакан» — и цифра, и визуальный стакан должны меняться вместе.
   - Код запускай через DOMContentLoaded.
15. ВАУ-ЭФФЕКТ (для первых версий приложений):
   - Добавь 1–2 «вау»-момента: CSS-анимации (transition, keyframes), emoji-праздник при достижении цели, умный автоматический расчёт (streak, «можно тратить сегодня», обратный отсчёт).
   - Не усложняй: без графиков на canvas, без drag-and-drop, без многостраничности.
   - Интерфейс должен радовать с первого клика — красиво, отзывчиво, с мгновенной обратной связью.`;

export const REFINEMENT_PROMPT = `Ты дорабатываешь существующее HTML-приложение по запросу пользователя.

ОБЯЗАТЕЛЬНО:
- Внеси ВСЕ запрошенные изменения в интерфейс и логику.
- Не возвращай идентичный HTML — пользователь должен увидеть разницу.
- Сохрани ключи localStorage и существующие данные пользователя.
- Если пользователь жалуется что «ничего не изменилось» или «нет картинок» — добавь именно то, что он просил, более явно и заметно.
- Если кнопки не работают или стаканы/галочки не обновляются — почини JS: addEventListener + общая render().
- Верни ПОЛНЫЙ обновлённый HTML-дocument от <!DOCTYPE html> до </html>.`;

export type ChatTurn = { role: "user" | "assistant"; content: string };

/** Разворачивает короткую идею пользователя в структурированный бриф (как у шаблонов). */
export function enrichCustomPrompt(userText: string): string {
  return `Мини-приложение по идее пользователя.

Идея: ${userText}

Обязательная структура (как у готовых шаблонов):
- Одна страница, mobile-first, интерфейс на русском
- Главное действие сразу видно: кнопка добавить / отметить / сохранить
- localStorage для данных, addEventListener на все кнопки, одна функция render()
- Прогресс или счётчик, который обновляется при каждом действии
- 1 вау-момент: CSS-анимация, emoji-праздник при цели или умный расчёт (streak, лимит, %)
- Emoji и inline SVG вместо картинок — без внешних URL
- Компактный код: один экран, без лишних секций — чтобы приложение быстро собралось

Не делай: многостраничность, canvas-графики, drag-and-drop, внешние скрипты.`;
}

export function buildUserMessage(
  prompt: string,
  existingHtml?: string,
  history?: ChatTurn[],
  themePrompt?: string,
): string {
  if (existingHtml) {
    const historyBlock =
      history && history.length > 0
        ? `\n\nИстория диалога:\n${history
            .map((m) => `${m.role === "user" ? "Пользователь" : "Ассистент"}: ${m.content}`)
            .join("\n")}\n`
        : "";

    return `Текущий HTML-приложения:

${existingHtml}
${historyBlock}
Новый запрос на доработку: ${prompt}

Верни полный обновлённый HTML с видимыми изменениями.`;
  }

  return `Создай мини-приложение с вау-эффектом (красивая анимация, приятная обратная связь, один умный автоматический расчёт):

${themePrompt ? themePrompt + "\n\n" : ""}${prompt}`;
}

export function normalizeHtml(html: string): string {
  return html.replace(/\s+/g, " ").trim();
}

export function htmlChanged(before: string, after: string): boolean {
  return normalizeHtml(before) !== normalizeHtml(after);
}
