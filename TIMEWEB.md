# Деплой на Timeweb — пошагово

Если «не выгружается» / падает сборка — чаще всего одна из причин ниже.

## Способ A — Next.js + SSR (App Platform)

1. [timeweb.cloud/my](https://timeweb.cloud/my) → **App Platform** → **Создать**
2. Тип: **Frontend** → **Next.js** (не «HTML» и не «React»)
3. Репозиторий: `https://github.com/xbaranova-neiro/vibe-tools`, ветка **`main`**
4. **Путь к проекту:** оставить пустым (корень репо)
5. **SSR — ВКЛЮЧИТЬ** (галочка обязательна). Без SSR `/api/generate` не работает, приложение бесполезно
6. Node.js: **20**
7. Команды (скопировать точно):

| Поле | Значение |
|------|----------|
| Установка зависимостей | `npm ci` или `npm install` |
| Сборка | `npm run build` |
| Запуск | `npm start` |

8. **Не указывайте** директорию сборки `out` — у Next.js SSR это `.next`, платформа сама знает
9. Переменные окружения:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
NEXT_PUBLIC_APP_URL=https://ВАШ-ДОМЕН.timeweb.cloud
APP_URL=https://ВАШ-ДОМЕН.timeweb.cloud
NODE_ENV=production
```

`NEXT_PUBLIC_APP_URL` подставьте **после** первого деплоя, когда увидите URL в дашборде — затем **пересоберите** приложение.

10. **Заказать** → вкладка **Деплой** → смотреть лог до конца

### Если сборка падает

- В логе `Cannot find module 'tailwindcss'` или `typescript` — в репо уже есть `.npmrc` с `production=false`, сделайте **Redeploy** после pull
- `Could not find production build` — команда сборки должна быть `npm run build`, не `next export`
- `EACCES` / `port` — команда запуска: `npm start` (слушает `PORT` от Timeweb)

---

## Способ B — Backend Node.js (если Next.js-шаблон не подключает GitHub)

1. App Platform → **Backend** → **Node.js**
2. Тот же репозиторий, ветка `main`
3. Node **20**
4. Сборка: `npm run build`
5. Запуск: `npm start`
6. Те же переменные окружения

---

## Способ C — Docker (самый надёжный)

1. App Platform → **Docker** (или Docker Compose)
2. Репозиторий `vibe-tools`, ветка `main`
3. Dockerfile в корне — уже в репозитории
4. Порт контейнера: **3000**
5. Переменные: `OPENAI_API_KEY`, `NEXT_PUBLIC_APP_URL`, `APP_URL`

---

## Проверка после деплоя

Откройте в браузере **без VPN**:

```
https://ВАШ-ДОМЕН.timeweb.cloud/api/health
```

Должно вернуть: `{"ok":true,"openai":true,...}`

Затем главная → шаблон **Витамины** → добавить витамин.

---

## Частые ошибки

| Симптом | Решение |
|---------|---------|
| GitHub не подключается | Авторизуйте Timeweb в GitHub → Settings → Applications |
| Репозиторий приватный | Дайте доступ Timeweb Cloud к repo |
| SSR не включили | Удалите приложение, создайте заново **с SSR** |
| AI не работает | Проверьте `OPENAI_API_KEY` в переменных, redeploy |
| Страница белая | Лог **Запуск** — должно быть `Ready on http://0.0.0.0:PORT` |

---

## Локальная проверка перед деплоем

```bash
npm ci
npm run build
PORT=3000 npm start
curl http://localhost:3000/api/health
```

Если локально OK, а на Timeweb нет — пришлите **текст ошибки из вкладки Деплой** (последние 30 строк лога).
