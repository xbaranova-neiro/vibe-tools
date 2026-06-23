import OpenAI from "openai";
import { NextResponse } from "next/server";

import { extractHtml, isValidGeneratedHtml, sanitizeHtml } from "@/lib/extract-html";
import {
  buildUserMessage,
  htmlChanged,
  REFINEMENT_PROMPT,
  SYSTEM_PROMPT,
  type ChatTurn,
} from "@/lib/prompts";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(ip);

    if (!limit.allowed) {
      const retryMinutes = Math.ceil((limit.resetAt - Date.now()) / 60000);
      return NextResponse.json(
        {
          error: `Лимит генераций исчерпан. Попробуйте через ${retryMinutes} мин.`,
        },
        { status: 429 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "API ключ не настроен на сервере." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as {
      prompt?: string;
      existingHtml?: string;
      history?: ChatTurn[];
      themePrompt?: string;
    };

    const prompt = body.prompt?.trim();
    if (!prompt) {
      return NextResponse.json(
        { error: "Введите описание приложения." },
        { status: 400 },
      );
    }

    const isRefinement = Boolean(body.existingHtml);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: isRefinement
            ? `${SYSTEM_PROMPT}\n\n${REFINEMENT_PROMPT}`
            : SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildUserMessage(
            prompt,
            body.existingHtml,
            body.history,
            body.themePrompt,
          ),
        },
      ],
      temperature: isRefinement ? 0.85 : 0.7,
      max_tokens: 12000,
    });

    const choice = completion.choices[0];
    const raw = choice?.message?.content;
    if (choice?.finish_reason === "length") {
      return NextResponse.json(
        {
          error:
            "Ответ обрезан — приложение слишком большое. Попросите одно конкретное изменение.",
        },
        { status: 502 },
      );
    }
    if (!raw) {
      return NextResponse.json(
        { error: "Модель не вернула результат. Попробуйте ещё раз." },
        { status: 502 },
      );
    }

    const html = sanitizeHtml(extractHtml(raw));

    if (!isValidGeneratedHtml(html)) {
      return NextResponse.json(
        { error: "Не удалось получить HTML. Попробуйте переформулировать запрос." },
        { status: 502 },
      );
    }

    if (body.existingHtml && !htmlChanged(body.existingHtml, html)) {
      return NextResponse.json(
        {
          error:
            "Модель не изменила приложение. Опишите конкретнее: что добавить и где.",
          unchanged: true,
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      html,
      remaining: limit.remaining,
    });
  } catch (error) {
    console.error("Generate error:", error);

    const message =
      error instanceof Error && error.message.includes("401")
        ? "Неверный API ключ OpenAI."
        : error instanceof Error && error.message.includes("429")
          ? "Слишком много запросов к OpenAI. Подождите минуту."
          : "Ошибка генерации. Попробуйте позже.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
