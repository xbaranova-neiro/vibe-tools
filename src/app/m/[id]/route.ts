import { loadStandaloneApp } from "@/lib/app-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const NOT_FOUND = `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Не найдено</title></head><body style="font-family:system-ui,sans-serif;background:#07070f;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;text-align:center"><div><p style="font-size:40px">😔</p><p>Приложение не найдено или срок хранения истёк.<br>Создайте его заново на <a href="/" style="color:#a78bfa">Vibe Tools</a>.</p></div></body></html>`;

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const html = await loadStandaloneApp(id);

  if (!html) {
    return new Response(NOT_FOUND, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export const dynamic = "force-dynamic";
