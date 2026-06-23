# Vibe Tools

Песочница вайб-кодинга: опиши идею — получи готовое HTML-мини-приложение.

## Запуск локально

```bash
npm install
cp .env.example .env.local   # добавь OPENAI_API_KEY
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000)

## Почему Vercel «не генерит» без VPN

Генерация идёт через `/api/generate` на **вашем** сервере. Если без VPN сайт на `*.vercel.app` не открывается или API не отвечает — это блокировка/нестабильность доступа к Vercel из РФ, а не поломка кода.

**Что работает без API:** готовые шаблоны (витамины, бюджет, вода…) — собираются мгновенно на устройстве.

**Что нужен сервер:** своя идея с AI, доработка в чате.

**Решение:** деплой на [Timeweb Cloud App Platform](https://timeweb.cloud/my) — доступен без VPN, нет лимита 10 сек как на бесплатном Vercel.

## Деплой на Timeweb (рекомендуется)

1. Код в GitHub: `xbaranova-neiro/vibe-tools`, ветка `main`.
2. [Timeweb Cloud](https://timeweb.cloud/my) → **App Platform** → **Создать** → **Next.js**.
3. Подключить репозиторий, ветка `main`.
4. **Включить SSR** (обязательно — иначе `/api/generate` не заработает).
5. Node.js **20** или **22**.
6. Команды:
   - сборка: `npm run build`
   - запуск: `npm start` (слушает `PORT` автоматически)
7. Переменные окружения:

| Переменная | Значение |
|---|---|
| `OPENAI_API_KEY` | ваш ключ OpenAI |
| `OPENAI_MODEL` | `gpt-4.1-mini` (опционально) |
| `NEXT_PUBLIC_APP_URL` | `https://ваш-домен.timeweb.cloud` (URL из дашборда, без `/` в конце) |
| `APP_URL` | то же самое |

8. **Запустить деплой** → скопировать технический домен.
9. (Опционально) На Vercel добавить `NEXT_PUBLIC_TIMEWEB_URL` = ссылка Timeweb — на Vercel появится подсказка «откройте версию на Timeweb».

### VPS / Docker (альтернатива)

```bash
npm run build
PORT=3000 OPENAI_API_KEY=sk-... NEXT_PUBLIC_APP_URL=https://your.domain npm start
```

## Vercel (зеркало, может требовать VPN)

```bash
npm run build
```

Переменные: `OPENAI_API_KEY`, опционально `NEXT_PUBLIC_TIMEWEB_URL`.

## Тесты

```bash
npm run test:lib
TEST_BASE_URL=http://localhost:3010 npm run test:api
npm run lint && npm run build
```

## Стоимость OpenAI

~0.3–0.7 ₽ за генерацию (gpt-4.1-mini)
