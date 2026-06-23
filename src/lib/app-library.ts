export type AppChatMessage = { role: "user" | "assistant"; content: string };

export type SavedAppIndex = {
  id: string;
  title: string;
  emoji: string;
  templateId: string | null;
  createdAt: number;
  updatedAt: number;
};

export type SavedApp = SavedAppIndex & {
  html: string;
  messages: AppChatMessage[];
};

const INDEX_KEY = "vibe-tools-library";
const APP_PREFIX = "vibe-tools-app-";
const MAX_APPS = 30;

function readIndex(): SavedAppIndex[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedAppIndex[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeIndex(entries: SavedAppIndex[]): void {
  localStorage.setItem(INDEX_KEY, JSON.stringify(entries));
}

export function listSavedApps(): SavedAppIndex[] {
  return readIndex().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getSavedApp(id: string): SavedApp | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(APP_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw) as SavedApp;
  } catch {
    return null;
  }
}

export function deleteSavedApp(id: string): void {
  const next = readIndex().filter((e) => e.id !== id);
  writeIndex(next);
  localStorage.removeItem(APP_PREFIX + id);
}

export function saveSavedApp(app: SavedApp): void {
  let index = readIndex().filter((e) => e.id !== app.id);
  index.unshift({
    id: app.id,
    title: app.title,
    emoji: app.emoji,
    templateId: app.templateId,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
  });
  if (index.length > MAX_APPS) {
    const dropped = index.slice(MAX_APPS);
    index = index.slice(0, MAX_APPS);
    for (const entry of dropped) {
      localStorage.removeItem(APP_PREFIX + entry.id);
    }
  }
  writeIndex(index);
  localStorage.setItem(APP_PREFIX + app.id, JSON.stringify(app));
}

export function createAppId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `app-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatAppDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) {
    return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}
