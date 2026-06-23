export type VibeTheme = {
  id: string;
  name: string;
  emoji: string;
  promptHint: string;
  vizStyle: string;
  vars: Record<string, string>;
};

const RADII = ["16px", "20px", "24px", "28px"] as const;
const CARD_STYLES = ["glass", "solid", "soft"] as const;

export type ThemeExtras = {
  radius: string;
  cardStyle: string;
};

function buildTheme(
  base: Omit<VibeTheme, "vars"> & { vars: Record<string, string> },
): VibeTheme {
  return base;
}

export const VIBE_THEMES: VibeTheme[] = [
  buildTheme({
    id: "ocean",
    name: "Океан",
    emoji: "🌊",
    promptHint: "глубокий синий, бирюза, cyan, морская свежесть",
    vizStyle: "волны, стеклянные карточки, пузырьки",
    vars: {
      "--vibe-bg1": "#0c4a6e",
      "--vibe-bg2": "#0284c7",
      "--vibe-bg3": "#38bdf8",
      "--vibe-accent": "#22d3ee",
      "--vibe-accent-light": "#a5f3fc",
      "--vibe-accent-text": "#0c4a6e",
      "--vibe-highlight": "#6366f1",
      "--vibe-card": "rgba(255,255,255,0.12)",
      "--vibe-card-border": "rgba(255,255,255,0.22)",
      "--vibe-glow": "rgba(34,211,238,0.45)",
      "--vibe-danger": "#ef4444",
      "--vibe-success": "#4ade80",
    },
  }),
  buildTheme({
    id: "sunset",
    name: "Закат",
    emoji: "🌅",
    promptHint: "оранжевый, коралловый, розовый, тёплый gradient заката",
    vizStyle: "мягкие округлые формы, тёплое свечение",
    vars: {
      "--vibe-bg1": "#7c2d12",
      "--vibe-bg2": "#ea580c",
      "--vibe-bg3": "#fb923c",
      "--vibe-accent": "#fbbf24",
      "--vibe-accent-light": "#fde68a",
      "--vibe-accent-text": "#78350f",
      "--vibe-highlight": "#f97316",
      "--vibe-card": "rgba(255,255,255,0.14)",
      "--vibe-card-border": "rgba(255,237,213,0.35)",
      "--vibe-glow": "rgba(251,191,36,0.5)",
      "--vibe-danger": "#dc2626",
      "--vibe-success": "#86efac",
    },
  }),
  buildTheme({
    id: "forest",
    name: "Лес",
    emoji: "🌲",
    promptHint: "изумрудный, хвойный, мох, природная зелень",
    vizStyle: "органические формы, листья, природные акценты",
    vars: {
      "--vibe-bg1": "#14532d",
      "--vibe-bg2": "#15803d",
      "--vibe-bg3": "#4ade80",
      "--vibe-accent": "#2dd4bf",
      "--vibe-accent-light": "#99f6e4",
      "--vibe-accent-text": "#134e4a",
      "--vibe-highlight": "#22c55e",
      "--vibe-card": "rgba(255,255,255,0.1)",
      "--vibe-card-border": "rgba(187,247,208,0.25)",
      "--vibe-glow": "rgba(74,222,128,0.4)",
      "--vibe-danger": "#f87171",
      "--vibe-success": "#bbf7d0",
    },
  }),
  buildTheme({
    id: "lavender",
    name: "Лаванда",
    emoji: "💜",
    promptHint: "сиреневый, фиолетовый, лавандовый, мягкий purple gradient",
    vizStyle: "мечтательные градиенты, мягкие тени",
    vars: {
      "--vibe-bg1": "#4c1d95",
      "--vibe-bg2": "#7c3aed",
      "--vibe-bg3": "#c4b5fd",
      "--vibe-accent": "#e879f9",
      "--vibe-accent-light": "#f5d0fe",
      "--vibe-accent-text": "#581c87",
      "--vibe-highlight": "#a78bfa",
      "--vibe-card": "rgba(255,255,255,0.11)",
      "--vibe-card-border": "rgba(233,213,255,0.3)",
      "--vibe-glow": "rgba(232,121,249,0.45)",
      "--vibe-danger": "#fb7185",
      "--vibe-success": "#a7f3d0",
    },
  }),
  buildTheme({
    id: "cherry",
    name: "Вишня",
    emoji: "🍒",
    promptHint: "розовый, малиновый, красный, романтичная палитра",
    vizStyle: "игривые акценты, сердечки, яркие кнопки",
    vars: {
      "--vibe-bg1": "#831843",
      "--vibe-bg2": "#be185d",
      "--vibe-bg3": "#f472b6",
      "--vibe-accent": "#fb7185",
      "--vibe-accent-light": "#fecdd3",
      "--vibe-accent-text": "#881337",
      "--vibe-highlight": "#ec4899",
      "--vibe-card": "rgba(255,255,255,0.13)",
      "--vibe-card-border": "rgba(252,231,243,0.3)",
      "--vibe-glow": "rgba(244,114,182,0.5)",
      "--vibe-danger": "#ef4444",
      "--vibe-success": "#86efac",
    },
  }),
  buildTheme({
    id: "midnight",
    name: "Полночь",
    emoji: "🌙",
    promptHint: "тёмно-синий, индиго, звёздное небо, контрастные акценты",
    vizStyle: "тёмный фон, неоновые акценты, звёзды",
    vars: {
      "--vibe-bg1": "#0f172a",
      "--vibe-bg2": "#1e1b4b",
      "--vibe-bg3": "#312e81",
      "--vibe-accent": "#818cf8",
      "--vibe-accent-light": "#c7d2fe",
      "--vibe-accent-text": "#1e1b4b",
      "--vibe-highlight": "#6366f1",
      "--vibe-card": "rgba(255,255,255,0.08)",
      "--vibe-card-border": "rgba(129,140,248,0.25)",
      "--vibe-glow": "rgba(129,140,248,0.55)",
      "--vibe-danger": "#f87171",
      "--vibe-success": "#34d399",
    },
  }),
  buildTheme({
    id: "honey",
    name: "Мёд",
    emoji: "🍯",
    promptHint: "золотой, янтарный, тёплый жёлтый, медовые тона",
    vizStyle: "солнечные блики, округлые кнопки, тепло",
    vars: {
      "--vibe-bg1": "#78350f",
      "--vibe-bg2": "#b45309",
      "--vibe-bg3": "#fbbf24",
      "--vibe-accent": "#fcd34d",
      "--vibe-accent-light": "#fef08a",
      "--vibe-accent-text": "#713f12",
      "--vibe-highlight": "#f59e0b",
      "--vibe-card": "rgba(255,255,255,0.15)",
      "--vibe-card-border": "rgba(254,240,138,0.35)",
      "--vibe-glow": "rgba(251,191,36,0.55)",
      "--vibe-danger": "#ef4444",
      "--vibe-success": "#4ade80",
    },
  }),
  buildTheme({
    id: "mint",
    name: "Мята",
    emoji: "🌿",
    promptHint: "мятный, бирюзовый, aqua, свежий spa-стиль",
    vizStyle: "чистые линии, свежесть, лёгкость",
    vars: {
      "--vibe-bg1": "#115e59",
      "--vibe-bg2": "#0d9488",
      "--vibe-bg3": "#5eead4",
      "--vibe-accent": "#2dd4bf",
      "--vibe-accent-light": "#ccfbf1",
      "--vibe-accent-text": "#134e4a",
      "--vibe-highlight": "#14b8a6",
      "--vibe-card": "rgba(255,255,255,0.12)",
      "--vibe-card-border": "rgba(153,246,228,0.28)",
      "--vibe-glow": "rgba(45,212,191,0.45)",
      "--vibe-danger": "#fb7185",
      "--vibe-success": "#6ee7b7",
    },
  }),
  buildTheme({
    id: "coral",
    name: "Коралл",
    emoji: "🪸",
    promptHint: "коралловый, персиковый, salmon, тропический",
    vizStyle: "тропические акценты, мягкий peach gradient",
    vars: {
      "--vibe-bg1": "#9f1239",
      "--vibe-bg2": "#e11d48",
      "--vibe-bg3": "#fb7185",
      "--vibe-accent": "#fda4af",
      "--vibe-accent-light": "#ffe4e6",
      "--vibe-accent-text": "#881337",
      "--vibe-highlight": "#f43f5e",
      "--vibe-card": "rgba(255,255,255,0.14)",
      "--vibe-card-border": "rgba(255,228,230,0.32)",
      "--vibe-glow": "rgba(251,113,133,0.5)",
      "--vibe-danger": "#dc2626",
      "--vibe-success": "#4ade80",
    },
  }),
  buildTheme({
    id: "neon",
    name: "Неон",
    emoji: "⚡",
    promptHint: "электрик purple, cyan, чёрный фон, cyberpunk неон",
    vizStyle: "неоновое свечение, контраст, футуристично",
    vars: {
      "--vibe-bg1": "#09090b",
      "--vibe-bg2": "#3b0764",
      "--vibe-bg3": "#581c87",
      "--vibe-accent": "#22d3ee",
      "--vibe-accent-light": "#a5f3fc",
      "--vibe-accent-text": "#09090b",
      "--vibe-highlight": "#d946ef",
      "--vibe-card": "rgba(255,255,255,0.06)",
      "--vibe-card-border": "rgba(34,211,238,0.35)",
      "--vibe-glow": "rgba(217,70,239,0.6)",
      "--vibe-danger": "#f43f5e",
      "--vibe-success": "#22c55e",
    },
  }),
];

const LAST_THEME_KEY = "vibe-last-theme";

export function pickRandomTheme(): { theme: VibeTheme; extras: ThemeExtras } {
  let pool = [...VIBE_THEMES];

  try {
    const lastId = sessionStorage.getItem(LAST_THEME_KEY);
    if (lastId) {
      const filtered = pool.filter((t) => t.id !== lastId);
      if (filtered.length > 0) pool = filtered;
    }
  } catch {
    /* ignore */
  }

  const theme = pool[Math.floor(Math.random() * pool.length)]!;
  const extras: ThemeExtras = {
    radius: RADII[Math.floor(Math.random() * RADII.length)]!,
    cardStyle: CARD_STYLES[Math.floor(Math.random() * CARD_STYLES.length)]!,
  };

  try {
    sessionStorage.setItem(LAST_THEME_KEY, theme.id);
  } catch {
    /* ignore */
  }

  return { theme, extras };
}

export function themeToPrompt(theme: VibeTheme, extras: ThemeExtras): string {
  return `Визуальный стиль приложения:
- Цвета: ${theme.promptHint}
- UI: ${theme.vizStyle}
- Скругления: ${extras.radius}
- Карточки: ${extras.cardStyle === "glass" ? "стекло с blur" : extras.cardStyle === "solid" ? "плотные блоки" : "мягкие полупрозрачные"}
- Gradient фона: ${theme.vars["--vibe-bg1"]} → ${theme.vars["--vibe-bg2"]} → ${theme.vars["--vibe-bg3"]}
- Акценты: ${theme.vars["--vibe-accent"]}, ${theme.vars["--vibe-accent-light"]}`;
}

export function themeVarsCss(
  theme: VibeTheme,
  extras: ThemeExtras,
): string {
  const cardBg =
    extras.cardStyle === "solid"
      ? theme.vars["--vibe-bg2"] + "cc"
      : extras.cardStyle === "soft"
        ? "rgba(255,255,255,0.18)"
        : theme.vars["--vibe-card"]!;

  const entries = {
    ...theme.vars,
    "--vibe-card": cardBg,
    "--vibe-radius": extras.radius,
  };

  return `:root{${Object.entries(entries)
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}}`;
}
