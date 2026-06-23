import { gunzipSync } from "zlib";

function base64urlDecode(encoded: string): Buffer {
  const padded =
    encoded.replace(/-/g, "+").replace(/_/g, "/") +
    "=".repeat((4 - (encoded.length % 4)) % 4);
  return Buffer.from(padded, "base64");
}

/** Декодирование payload на сервере (для /api/view). */
export function decodeHtmlPayloadServer(payload: string): string | null {
  let clean = payload.trim();
  try {
    clean = decodeURIComponent(clean);
  } catch {
    /* уже декодирован */
  }
  clean = clean.replace(/^#/, "").trim();
  if (!clean) return null;

  try {
    if (clean.startsWith("v1.")) {
      return gunzipSync(base64urlDecode(clean.slice(3))).toString("utf-8");
    }
    if (clean.startsWith("v0.")) {
      return base64urlDecode(clean.slice(3)).toString("utf-8");
    }
  } catch {
    return null;
  }

  return null;
}
