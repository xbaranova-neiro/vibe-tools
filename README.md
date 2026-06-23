# Vibe Tools

Песочница вайб-кодинга: опиши идею — получи готовое HTML-мини-приложение.

## Запуск

```bash
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000)

## Тесты

```bash
npm run test:lib          # unit-тесты парсера HTML
TEST_BASE_URL=http://localhost:3010 npm run test:api  # API + генерация
npm run lint
npm run build
```

## Настройка

Создай `.env.local`:

```
OPENAI_API_KEY=sk-...
```

## Возможности

- 5 шаблонов (бюджет, привычки, задачи, кружки, покупки)
- Свободный промпт
- Превью в sandbox iframe
- Доработка промптом
- Скачивание `.html`
- Сохранение сессии в `sessionStorage`
- Rate limit: 10 генераций в час на IP

## Деплой

### Timeweb Cloud App Platform

Проект использует API (`/api/generate`), поэтому нужен **Next.js с SSR**, не статический экспорт.

1. Залей код в GitHub (репозиторий `vibe-tools`).
2. [Timeweb Cloud](https://timeweb.cloud/my) → **App Platform** → **Создать** → **Next.js**.
3. Подключи GitHub-репозиторий, ветка `main`.
4. Включи **SSR** (иначе API не заработает).
5. Node.js **20** или **22**.
6. Команды (обычно подставляются сами):
   - сборка: `npm run build`
   - запуск: `npm start`
7. Переменные окружения → добавь `OPENAI_API_KEY`.
8. **Запустить деплой** → скопируй технический домен с вкладки «Дашборд».

### Vercel

```bash
npm run build
```

Добавь переменную `OPENAI_API_KEY` в настройках проекта.

## Стоимость

~0.3–0.7 ₽ за генерацию (GPT-4o mini)
