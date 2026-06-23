export type AppFont = {
  id: string;
  family: string;
  importUrl: string | null;
};

export type AppVariation = {
  font: AppFont;
  gradientAngle: number;
  gradientStyle: "linear" | "radial";
  pattern: "dots" | "grid" | "diagonal" | "bubbles" | "none";
  density: "compact" | "cozy" | "airy";
  buttonShape: "pill" | "soft" | "square";
  titleStyle: "plain" | "gradient" | "glow";
  cardLayout: "flat" | "glass" | "elevated";
  accentGlow: boolean;
};

const FONTS: AppFont[] = [
  {
    id: "system",
    family: "system-ui, -apple-system, sans-serif",
    importUrl: null,
  },
  {
    id: "nunito",
    family: '"Nunito", system-ui, sans-serif',
    importUrl:
      "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&display=swap",
  },
  {
    id: "rubik",
    family: '"Rubik", system-ui, sans-serif',
    importUrl:
      "https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;800&display=swap",
  },
  {
    id: "montserrat",
    family: '"Montserrat", system-ui, sans-serif',
    importUrl:
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800&display=swap",
  },
  {
    id: "comfortaa",
    family: '"Comfortaa", system-ui, sans-serif',
    importUrl:
      "https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;700&display=swap",
  },
  {
    id: "manrope",
    family: '"Manrope", system-ui, sans-serif',
    importUrl:
      "https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&display=swap",
  },
  {
    id: "playfair",
    family: '"Playfair Display", Georgia, serif',
    importUrl:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap",
  },
];

const TITLE_POOL: Record<string, string[]> = {
  budget: [
    "💰 Семейный бюджет",
    "💳 Мои финансы",
    "📊 Деньги под контролем",
    "🏦 Личный кошелёк",
  ],
  habits: [
    "💧 Трекер воды",
    "🥤 Пей воду",
    "💦 Гидратация",
    "🌊 Водный баланс",
  ],
  tasks: [
    "✅ Дела на сегодня",
    "📋 Мой план",
    "🎯 Фокус дня",
    "⚡ Список задач",
  ],
  kids: [
    "🎨 Кружки ребёнка",
    "🧒 Расписание",
    "⭐ Занятия малыша",
    "🎪 Кружки и секции",
  ],
  shopping: [
    "🛒 Список покупок",
    "🛍️ В магазин",
    "🥬 Продуктовая корзина",
    "📝 Что купить",
  ],
  pills: [
    "💊 Витамины",
    "💉 Таблетки",
    "🌿 Здоровье",
    "☀️ Приём витаминов",
  ],
  watchlist: [
    "🎬 Фильмы и сериалы",
    "🍿 Мой watchlist",
    "📺 Что посмотреть",
    "🎥 Кино-список",
  ],
};

const SUB_POOL: Record<string, string[]> = {
  budget: [
    "Следи за балансом без таблиц",
    "Доходы, расходы — всё на виду",
    "Умный учёт семейных трат",
  ],
  habits: [
    "Пей и побеждай!",
    "8 стаканов — и ты молодец",
    "Маленькие глотки — большая цель",
  ],
  tasks: [
    "Один шаг — и ближе к цели",
    "Отмечай — и двигайся дальше",
    "Сегодня можно всё",
  ],
  kids: [
    "Ничего не пропустим",
    "Кружки всегда под рукой",
    "Расписание без хаоса",
  ],
  shopping: [
    "Ничего лишнего в корзине",
    "Бери только нужное",
    "Список, который работает",
  ],
  pills: [
    "Утро и вечер — без пропусков",
    "Здоровье под контролем",
    "Напомним, если забыли",
  ],
  watchlist: [
    "Что посмотреть на выходных",
    "Фильмы и сериалы в одном месте",
    "От «хочу» до «готово»",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function pickAppVariation(): AppVariation {
  return {
    font: pick(FONTS),
    gradientAngle: pick([125, 145, 160, 180, 200, 220, 270, 315]),
    gradientStyle: pick(["linear", "radial"]),
    pattern: pick(["dots", "grid", "diagonal", "bubbles", "none"]),
    density: pick(["compact", "cozy", "airy"]),
    buttonShape: pick(["pill", "soft", "square"]),
    titleStyle: pick(["plain", "gradient", "glow"]),
    cardLayout: pick(["flat", "glass", "elevated"]),
    accentGlow: Math.random() > 0.35,
  };
}

function patternCss(pattern: AppVariation["pattern"]): string {
  switch (pattern) {
    case "dots":
      return `body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background-image:radial-gradient(circle,rgba(255,255,255,.09) 1px,transparent 1px);background-size:22px 22px;opacity:.55}`;
    case "grid":
      return `body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:32px 32px;opacity:.45}`;
    case "diagonal":
      return `body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background:repeating-linear-gradient(-45deg,transparent,transparent 12px,rgba(255,255,255,.04) 12px,rgba(255,255,255,.04) 24px);opacity:.6}`;
    case "bubbles":
      return `body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(circle at 15% 20%,rgba(255,255,255,.12) 0,transparent 35%),radial-gradient(circle at 85% 75%,rgba(255,255,255,.08) 0,transparent 40%),radial-gradient(circle at 50% 90%,rgba(255,255,255,.06) 0,transparent 30%)}`;
    default:
      return "";
  }
}

export function variationCss(v: AppVariation): string {
  const pad =
    v.density === "compact" ? "14px 12px" : v.density === "airy" ? "32px 20px" : "22px 16px";
  const cardPad =
    v.density === "compact" ? "16px 14px" : v.density === "airy" ? "32px 24px" : "24px 20px";
  const maxW =
    v.density === "airy" ? "460px" : v.density === "compact" ? "400px" : "440px";
  const btnRadius =
    v.buttonShape === "pill" ? "999px" : v.buttonShape === "square" ? "8px" : "14px";
  const cardRadius =
    v.buttonShape === "square" ? "12px" : v.buttonShape === "pill" ? "28px" : "20px";

  const bg =
    v.gradientStyle === "radial"
      ? `radial-gradient(ellipse at 30% 20%,var(--vibe-bg3),var(--vibe-bg2) 45%,var(--vibe-bg1))`
      : `linear-gradient(${v.gradientAngle}deg,var(--vibe-bg1),var(--vibe-bg2) 48%,var(--vibe-bg3))`;

  const titleCss =
    v.titleStyle === "gradient"
      ? `h1{background:linear-gradient(135deg,#fff,var(--vibe-accent-light));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}`
      : v.titleStyle === "glow"
        ? `h1{text-shadow:0 0 24px var(--vibe-glow),0 2px 8px rgba(0,0,0,.3)}`
        : "";

  const cardCss =
    v.cardLayout === "glass"
      ? `.card,.balance,.daily,.next,.progress-box,.streak,.chart-wrap,.form,.hero .balance{backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important}`
      : v.cardLayout === "elevated"
        ? `.card,.balance,.daily,.next,.progress-box,.streak,.chart-wrap{box-shadow:0 16px 48px rgba(0,0,0,.35)!important}`
        : `.card,.balance,.daily,.next,.progress-box,.streak,.chart-wrap{box-shadow:none!important;border-width:1px!important}`;

  const glowCss = v.accentGlow
    ? `.btn-add,.btn,.btn-add:not(.btn-reset){filter:drop-shadow(0 0 8px var(--vibe-glow))}`
    : "";

  return `
body{font-family:${v.font.family}!important;background:${bg}!important;padding:${pad}!important;position:relative}
body>*{position:relative;z-index:1}
.card{max-width:${maxW}!important;padding:${cardPad}!important;border-radius:${cardRadius}!important}
h1{letter-spacing:${v.font.id === "playfair" ? "-.02em" : "0"}!important;font-weight:800!important}
button,.btn-add,.btn,.btn-reset,.filters button{border-radius:${btnRadius}!important}
input,select{border-radius:${btnRadius}!important}
${titleCss}
${cardCss}
${glowCss}
${patternCss(v.pattern)}
`.replace(/\s+/g, " ");
}

export function variationToPrompt(v: AppVariation): string {
  return `Дополнительный визуальный характер (уникальная сборка):
- Шрифт: ${v.font.id === "playfair" ? "элегантный serif" : "современный — " + v.font.id}
- Фон: ${v.gradientStyle === "radial" ? "радиальный gradient" : `gradient под углом ${v.gradientAngle}°`}, декор «${v.pattern}»
- Плотность UI: ${v.density === "compact" ? "компактный" : v.density === "airy" ? "воздушный" : "сбалансированный"}
- Кнопки: ${v.buttonShape === "pill" ? "капсулы" : v.buttonShape === "square" ? "строгие прямоугольники" : "мягкие скругления"}
- Карточки: ${v.cardLayout === "glass" ? "стекло blur" : v.cardLayout === "elevated" ? "с тенью" : "плоские минималистичные"}
- Заголовок: ${v.titleStyle === "gradient" ? "gradient текст" : v.titleStyle === "glow" ? "с свечением" : "чистый"}
- Не копируй типовой dashboard — сделай узнаваемый уникальный mini-app`;
}

export function applyContentVariation(
  html: string,
  templateId: string | null,
): string {
  if (!templateId) return html;

  const titles = TITLE_POOL[templateId];
  if (titles?.length) {
    const title = pick(titles);
    html = html.replace(/<h1>[^<]*<\/h1>/, `<h1>${title}</h1>`);
  }

  const subs = SUB_POOL[templateId];
  if (subs?.length && html.includes('class="sub"')) {
    const sub = pick(subs);
    html = html.replace(
      /<p class="sub">[^<]*<\/p>/,
      `<p class="sub">${sub}</p>`,
    );
  }

  return html;
}

export function fontLinkTag(v: AppVariation): string {
  if (!v.font.importUrl) return "";
  return `<link rel="stylesheet" href="${v.font.importUrl}">`;
}
