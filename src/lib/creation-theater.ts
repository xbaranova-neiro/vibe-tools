export type CreationScript = {
  steps: string[];
  codeLines: string[];
};

export const CREATION_SCRIPTS: Record<string, CreationScript> = {
  budget: {
    steps: [
      "Читаю запрос про бюджет…",
      "Создаю форму доходов и расходов…",
      "Рисую круговую диаграмму CSS…",
      "Сохраняю в localStorage…",
    ],
    codeLines: [
      "const budget = { income: 0, expenses: [] }",
      "chart.style.background = conicGradient(cats)",
      "dailyLimit = balance / daysLeft()",
      "localStorage.setItem('budget', data)",
    ],
  },
  habits: {
    steps: [
      "Понял: трекер воды, 8 стаканов…",
      "Верстаю стаканы с анимацией…",
      "Добавляю прогресс-бар и streak…",
      "Запускаю приложение…",
    ],
    codeLines: [
      "for (let i = 0; i < 8; i++) createGlass()",
      "streak++ // дней подряд 🔥",
      "if (count >= 8) launchConfetti()",
      "addEventListener('click', addGlass)",
    ],
  },
  tasks: {
    steps: [
      "Создаю список задач…",
      "Рисую SVG-кольцо прогресса…",
      "Добавляю фильтры и галочки…",
      "Финальная сборка…",
    ],
    codeLines: [
      "tasks.push({ text, done: false })",
      "ring.strokeDashoffset = calc(percent)",
      "if (allDone) showCelebration()",
      "renderTasks()",
    ],
  },
  kids: {
    steps: [
      "Строю сетку недели…",
      "Добавляю карточки кружков…",
      "Считаю ближайшее занятие…",
      "Готово!",
    ],
    codeLines: [
      "days.forEach(d => highlightToday(d))",
      "next = findClosestEvent(now)",
      "setInterval(updateCountdown, 60000)",
      "renderSchedule()",
    ],
  },
  shopping: {
    steps: [
      "Создаю список покупок…",
      "Добавляю emoji по категориям…",
      "Строю прогресс «поход в магазин»…",
      "Собираю приложение…",
    ],
    codeLines: [
      "items.push({ name, emoji: '🥕', cat })",
      "progress = bought / total * 100",
      "if (progress === 100) show('🛍️ Всё!')",
      "localStorage.setItem('shop', items)",
    ],
  },
  pills: {
    steps: [
      "Настраиваю утро и вечер…",
      "Добавляю галочки приёма…",
      "Считаю прогресс за день…",
      "Включаю напоминания…",
    ],
    codeLines: [
      "meds.push({ name, morning, evening })",
      "if (hour >= 20 && !evening) warn()",
      "progress = taken / total * 100",
      "localStorage.setItem('pills', data)",
    ],
  },
  watchlist: {
    steps: [
      "Создаю список фильмов…",
      "Добавляю вкладки статусов…",
      "Рисую карточки-постеры…",
      "Готово к просмотру!",
    ],
    codeLines: [
      "shows.push({ title, status: 'want' })",
      "status = 'watching' // ▶️",
      "if (done) celebrate('🍿')",
      "localStorage.setItem('watch', shows)",
    ],
  },
};

export const GENERIC_CREATION: CreationScript = {
  steps: [
    "Анализирую ваш запрос…",
    "Пишу HTML-структуру…",
    "Добавляю стили и анимации…",
    "Подключаю JavaScript…",
  ],
  codeLines: [
    "<!DOCTYPE html>",
    "<style> /* mobile-first UI */ </style>",
    "function render() { /* UI */ }",
    "localStorage.setItem(…)",
  ],
};

export function getCreationScript(templateId?: string | null): CreationScript {
  if (templateId && CREATION_SCRIPTS[templateId]) {
    return CREATION_SCRIPTS[templateId];
  }
  return GENERIC_CREATION;
}

const MIN_THEATER_MS = 2400;

export function waitForTheater(startTime: number): Promise<void> {
  const elapsed = Date.now() - startTime;
  const remaining = MIN_THEATER_MS - elapsed;
  if (remaining <= 0) return Promise.resolve();
  return new Promise((r) => setTimeout(r, remaining));
}
