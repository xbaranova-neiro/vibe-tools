import { NextResponse } from "next/server";

import { probeOpenAI } from "@/lib/openai-client";

let cachedAiReady: { at: number; value: boolean } | null = null;
const CACHE_MS = 45_000;

async function aiReadyCached(): Promise<boolean> {
  const now = Date.now();
  if (cachedAiReady && now - cachedAiReady.at < CACHE_MS) {
    return cachedAiReady.value;
  }
  const value = await probeOpenAI();
  cachedAiReady = { at: now, value };
  return value;
}

export async function GET() {
  const hasKey = Boolean(process.env.OPENAI_API_KEY);
  let aiReady = false;
  if (hasKey) {
    try {
      aiReady = await aiReadyCached();
    } catch {
      aiReady = false;
    }
  }

  return NextResponse.json({
    ok: true,
    openai: hasKey,
    aiReady,
    host: process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? null,
  });
}

export const dynamic = "force-dynamic";
