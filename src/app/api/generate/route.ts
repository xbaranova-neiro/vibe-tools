
import { NextResponse } from "next/server";

import { extractHtml, isValidGeneratedHtml, sanitizeHtml } from "@/lib/extract-html";
import { extractAppHint, isClearRefineRequest } from "@/lib/chat-intent";
import { stripStudioLayers } from "@/lib/apply-theme";
import { getOpenAIClient } from "@/lib/openai-client";
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

/** На Vercel Hobby ~10 сек; на Timeweb/VPS лимита нет. */
export const maxDuration = 120;

const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
const OPENAI_CREATE_MODEL =
  process.env.OPENAI_CREATE_MODEL?.trim() ||
  (process.env.VERCEL ? "gpt-4o-mini" : "gpt-4.1-mini");

/** На Vercel Hobby ~10 сек — меньше токенов, быстрее модель. */
const CREATE_MAX_TOKENS = process.env.VERCEL ? 3800 : 5500;

async function generateChatReply(
  prompt: string,
  existingHtml: string,
  history?: ChatTurn[],
): Promise<string | null> {
  const openai = getOpenAIClient();
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
    const existingHtml = body.existingHtml
      ? stripStudioLayers(body.existingHtml)
      : undefined;

    if (isRefinement && existingHtml && !isClearRefineRequest(prompt)) {
      const reply = await generateChatReply(
        prompt,
        existingHtml,
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

    const completion = await getOpenAIClient().chat.completions.create({
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
            existingHtml,
            body.history,
            body.themePrompt,
          ),
        },
      ],
      temperature: isRefinement ? 0.85 : 0.65,
      max_tokens: isRefinement ? 12000 : CREATE_MAX_TOKENS,
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

    if (existingHtml && !htmlChanged(existingHtml, html)) {
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
        ? "Неверный ключ доступа к нейросети."
        : errText.includes("429")
          ? "Слишком много запросов. Подождите минуту."
          : errText.includes("timeout") || errText.includes("Timeout")
            ? "Генерация заняла слишком долго. Попробуйте шаблон или опишите идею короче."
            : "Не удалось создать. Попробуйте шаблон или переформулируйте запрос.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
