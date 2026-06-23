# Чтобы ВСЁ работало без VPN

## Быстрый путь (Timeweb + Docker)

1. [timeweb.cloud/my](https://timeweb.cloud/my) → **App Platform** → **Docker**
2. GitHub: `xbaranova-neiro/vibe-tools`, ветка `main`
3. Порт: **3000**
4. Переменные:
   ```
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=gpt-4.1-mini
   NEXT_PUBLIC_APP_URL=https://ВАШ-URL.timeweb.cloud
   APP_URL=https://ВАШ-URL.timeweb.cloud
   ```
5. Деплой → откройте URL **без VPN**
6. Проверка: `https://ВАШ-URL.timeweb.cloud/api/health` → `"aiReady":true`

## Что работает где

| Функция | Vercel без VPN | Timeweb без VPN |
|---------|----------------|-----------------|
| Шаблоны (витамины, бюджет…) | иногда | ✅ |
| Своя идея (AI) | ❌ часто | ✅ |
| Мои приложения | если сайт открылся | ✅ |

**Vercel для РФ — ненадёжно. Timeweb — основной вариант.**

## Если AI не работает на Timeweb

1. Проверьте `OPENAI_API_KEY` в переменных окружения
2. Redeploy после добавления ключа
3. Если OpenAI блокируется с сервера — задайте прокси:
   ```
   OPENAI_BASE_URL=https://ваш-прокси/v1
   ```

## Альтернатива: Next.js + SSR (без Docker)

См. раздел «Способ A» ниже.

---

# Подробная инструкция Timeweb

## Способ A — Next.js + SSR

1. App Platform → **Frontend** → **Next.js**
2. Репозиторий `xbaranova-neiro/vibe-tools`, ветка `main`
3. **SSR — ВКЛЮЧИТЬ**
4. Node.js **20**
5. Сборка: `npm run build` · Запуск: `npm start`
6. Переменные — как в разделе «Быстрый путь»

## Способ B — Backend Node.js

1. App Platform → **Backend** → **Node.js**
2. Тот же репозиторий
3. Сборка: `npm run build` · Запуск: `npm start`

## Способ C — Docker

Dockerfile и `docker-compose.yml` уже в репозитории.

Локально:
```bash
cp .env.example .env
# заполните OPENAI_API_KEY
docker compose up --build
```

## Проверка

```
/api/health → { "ok": true, "openai": true, "aiReady": true }
```

## Частые ошибки

| Ошибка | Решение |
|--------|---------|
| Сборка падает на tailwind | В репо есть `.npmrc`, redeploy |
| SSR не включён | Новое приложение с SSR |
| aiReady: false | Ключ OpenAI или OPENAI_BASE_URL |
| Зависает генерация | Не Vercel — используйте Timeweb |
