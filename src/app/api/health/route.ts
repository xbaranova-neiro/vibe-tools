import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    openai: Boolean(process.env.OPENAI_API_KEY),
    host: process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? null,
  });
}

export const dynamic = "force-dynamic";
