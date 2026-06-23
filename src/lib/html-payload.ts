import { prepareHtmlForStandalone } from "@/lib/prepare-html-for-preview";

export const MAX_PAYLOAD_LEN = 120_000;
export const MAX_HASH_LEN = MAX_PAYLOAD_LEN;

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
  const prepared = prepareHtmlForStandalone(html);

  if (typeof CompressionStream !== "undefined") {
    const compressed = await gzipText(prepared);
    const payload = `v1.${base64urlEncode(compressed)}`;
    if (payload.length <= MAX_PAYLOAD_LEN) return payload;
  }

  const raw = new TextEncoder().encode(prepared);
  return `v0.${base64urlEncode(raw)}`;
}

export async function decodeHtmlPayload(payload: string): Promise<string | null> {
  const clean = payload.replace(/^#/, "").trim();
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

export function appPagePath(payload: string): string {
  return `/api/view/${encodeURIComponent(payload)}`;
}

type PublishResponse = {
  url: string;
  mode?: string;
};

/** Публикует на сервере → короткая ссылка /m/abc123 (для Telegram-превью). */
export async function publishAppUrl(html: string): Promise<PublishResponse | null> {
  try {
    const res = await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });
    if (!res.ok) return null;
    return (await res.json()) as PublishResponse;
  } catch {
    return null;
  }
}
