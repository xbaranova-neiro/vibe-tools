import { head, put } from "@vercel/blob";

import { prepareHtmlForStandalone, ensureStandaloneRuntime } from "@/lib/prepare-html-for-preview";

const TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 дней

type MemoryEntry = { html: string; expires: number };

declare global {
  // eslint-disable-next-line no-var
  var __vibeAppStore: Map<string, MemoryEntry> | undefined;
}

function memStore(): Map<string, MemoryEntry> {
  if (!globalThis.__vibeAppStore) {
    globalThis.__vibeAppStore = new Map();
  }
  return globalThis.__vibeAppStore;
}

function randomId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 10);
}

function blobPath(id: string): string {
  return `vibe-apps/${id}.html`;
}

export function appOrigin(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function shortAppUrl(id: string): string {
  return `${appOrigin()}/m/${id}`;
}

/** Сохранить приложение на сервере → короткая ссылка для «На экран Домой». */
export async function publishStandaloneApp(
  html: string,
): Promise<{ id: string; url: string; mode: "short" | "memory" }> {
  const prepared = prepareHtmlForStandalone(html);
  const id = randomId();

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(blobPath(id), prepared, {
      access: "public",
      contentType: "text/html; charset=utf-8",
      addRandomSuffix: false,
      cacheControlMaxAge: TTL_MS / 1000,
    });
    return { id, url: shortAppUrl(id), mode: "short" };
  }

  memStore().set(id, { html: prepared, expires: Date.now() + TTL_MS });
  return { id, url: shortAppUrl(id), mode: "memory" };
}

/** Получить HTML приложения по короткому id. */
export async function loadStandaloneApp(id: string): Promise<string | null> {
  if (!/^[a-z0-9]{8,12}$/i.test(id)) return null;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const meta = await head(blobPath(id));
      const res = await fetch(meta.url);
      if (!res.ok) return null;
      const raw = await res.text();
      return ensureStandaloneRuntime(raw);
    } catch {
      return null;
    }
  }

  const entry = memStore().get(id);
  if (!entry) return null;
  if (entry.expires < Date.now()) {
    memStore().delete(id);
    return null;
  }
  return ensureStandaloneRuntime(entry.html);
}
