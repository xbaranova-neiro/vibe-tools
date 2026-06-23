import { prepareHtmlForExport } from "@/lib/prepare-html-for-preview";

/** Практический лимит длины hash в Safari на iOS. */
export const MAX_HASH_LEN = 120_000;

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function base64urlEncode(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(encoded: string): Uint8Array {
  const padded =
    encoded.replace(/-/g, "+").replace(/_/g, "/") +
    "===".slice((encoded.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function gzipText(text: string): Promise<Uint8Array> {
  const stream = new Blob([text])
    .stream()
    .pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function gunzipBytes(bytes: Uint8Array): Promise<string> {
  const copy = new Uint8Array(bytes);
  const stream = new Blob([copy])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  return new Response(stream).text();
}

export async function encodeHtmlPayload(html: string): Promise<string> {
  const prepared = prepareHtmlForExport(html);

  if (typeof CompressionStream !== "undefined") {
    const compressed = await gzipText(prepared);
    const payload = `v1.${base64urlEncode(compressed)}`;
    if (payload.length <= MAX_HASH_LEN) return payload;
  }

  const raw = new TextEncoder().encode(prepared);
  return `v0.${base64urlEncode(raw)}`;
}

export async function decodeHtmlPayload(hash: string): Promise<string | null> {
  const clean = hash.replace(/^#/, "").trim();
  if (!clean) return null;

  try {
    if (clean.startsWith("v1.")) {
      if (typeof DecompressionStream === "undefined") return null;
      return await gunzipBytes(base64urlDecode(clean.slice(3)));
    }
    if (clean.startsWith("v0.")) {
      return new TextDecoder().decode(base64urlDecode(clean.slice(3)));
    }
  } catch {
    return null;
  }

  return null;
}

export type HomeScreenResult = "ok" | "too-large" | "unsupported";

/** Открыть HTTPS-страницу приложения — с неё можно «На экран Домой» в Safari. */
export async function openForHomeScreen(html: string): Promise<HomeScreenResult> {
  if (typeof window === "undefined") return "unsupported";

  const payload = await encodeHtmlPayload(html);
  if (payload.length > MAX_HASH_LEN) return "too-large";

  window.location.assign(`${window.location.origin}/app#${payload}`);
  return "ok";
}

export function homeScreenUrl(html: string): Promise<string> {
  return encodeHtmlPayload(html).then(
    (payload) => `${typeof window !== "undefined" ? window.location.origin : ""}/app#${payload}`,
  );
}
