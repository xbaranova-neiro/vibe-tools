import OpenAI from "openai";
import { NextResponse } from "next/server";

import { extractHtml, isValidGeneratedHtml, sanitizeHtml } from "@/lib/extract-html";
import { extractAppHint, isClearRefineRequest } from "@/lib/chat-intent";
import {
  buildChatReplyMessage,
  buildUserMessage,
  CHAT_REPLY_PROMPT,
  htmlChanged,
  REFINEMENT_PROMPT,
  SYSTEM_PROMPT,
  type ChatTurn,
} from "@/lib/prompts";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/** До 60 сек на Pro; на Hobby Vercel ограничит ~10 сек. */
export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 55_000,
  maxRetries: 1,
});

const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
const OPENAI_CREATE_MODEL =
  process.env.OPENAI_CREATE_MODEL?.trim() || "gpt-4.1-mini";

async function generateChatReply(
  prompt: string,
  existingHtml: string,
  history?: ChatTurn[],
): Promise<string | null> {
  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: "system", content: CHAT_REPLY_PROMPT },
      {
        role: "user",
        content: buildChatReplyMessage(
          prompt,
          extractAppHint(existingHtml),
          history,
        ),
      },
    ],
    temperature: 0.65,
    max_tokens: 350,
  });

  const reply = completion.choices[0]?.message?.content?.trim();
  return reply || null;
}

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

    if (isRefinement && body.existingHtml && !isClearRefineRequest(prompt)) {
      const reply = await generateChatReply(
        prompt,
        body.existingHtml,
        body.history,
      );

      if (!reply) {
        return NextResponse.json(
          { error: "Не удалось ответить. Попробуйте переформулировать." },
          { status: 502 },
        );
      }

      return NextResponse.json({
        reply,
        remaining: limit.remaining,
      });
    }

    const completion = await openai.chat.completions.create({
      model: isRefinement ? OPENAI_MODEL : OPENAI_CREATE_MODEL,
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
      temperature: isRefinement ? 0.85 : 0.65,
      max_tokens: isRefinement ? 12000 : 5500,
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

    const errText = error instanceof Error ? error.message : "";
    const message =
      errText.includes("401")
        ? "Неверный API ключ OpenAI."
        : errText.includes("429")
          ? "Слишком много запросов к OpenAI. Подождите минуту."
          : errText.includes("timeout") || errText.includes("Timeout")
            ? "Генерация заняла слишком долго. На Vercel Hobby лимит ~10 сек — используйте Timeweb или шаблон."
            : "Ошибка генерации. Попробуйте шаблон или деплой на Timeweb (без VPN).";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
