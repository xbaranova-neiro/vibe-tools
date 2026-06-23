import { NextResponse } from "next/server";

import { publishStandaloneApp } from "@/lib/app-store";
import { appPagePath, encodeHtmlPayload } from "@/lib/html-payload";

type PublishBody = {
  html?: string;
};

export async function POST(request: Request) {
  let body: PublishBody;
  try {
    body = (await request.json()) as PublishBody;
  } catch {
    return NextResponse.json({ error: "Неверный JSON" }, { status: 400 });
  }

  if (!body.html?.trim()) {
    return NextResponse.json({ error: "Пустой HTML" }, { status: 400 });
  }

  try {
    const published = await publishStandaloneApp(body.html);
    return NextResponse.json({
      id: published.id,
      url: published.url,
      mode: published.mode,
    });
  } catch (err) {
    console.error("publish failed", err);
    const payload = await encodeHtmlPayload(body.html);
    const origin = new URL(request.url).origin;
    return NextResponse.json({
      url: `${origin}${appPagePath(payload)}`,
      mode: "long",
    });
  }
}

export const maxDuration = 30;
