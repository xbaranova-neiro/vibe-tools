import OpenAI from "openai";

let client: OpenAI | null = null;

/** OpenAI-клиент. OPENAI_BASE_URL — для прокси, если прямой api.openai.com недоступен с сервера. */
export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY не задан");
    }
    const baseURL = process.env.OPENAI_BASE_URL?.trim();
    const defaultTimeout = process.env.VERCEL ? 55_000 : 90_000;
    client = new OpenAI({
      apiKey,
      ...(baseURL ? { baseURL } : {}),
      timeout: Number(process.env.OPENAI_TIMEOUT_MS) || defaultTimeout,
      maxRetries: process.env.VERCEL ? 0 : 1,
    });
  }
  return client;
}

export async function probeOpenAI(): Promise<boolean> {
  if (!process.env.OPENAI_API_KEY) return false;
  try {
    const openai = getOpenAIClient();
    await openai.models.list();
    return true;
  } catch {
    return false;
  }
}
