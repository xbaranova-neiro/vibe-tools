import { decodeHtmlPayloadServer } from "@/lib/decode-payload-server";
import { ensureStandaloneRuntime } from "@/lib/prepare-html-for-preview";

type RouteContext = {
  params: Promise<{ payload: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { payload } = await context.params;
  const html = decodeHtmlPayloadServer(payload);

  if (!html) {
    return new Response(
      `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ошибка</title></head><body style="font-family:system-ui,sans-serif;background:#07070f;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;text-align:center"><div><p style="font-size:48px;margin:0 0 16px">⚠️</p><p>Не удалось открыть приложение.<br>Создайте его заново на <a href="/" style="color:#a78bfa">Vibe Tools</a>.</p></div></body></html>`,
      {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  }

  return new Response(ensureStandaloneRuntime(html), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, max-age=3600",
    },
  });
}

export const dynamic = "force-dynamic";
