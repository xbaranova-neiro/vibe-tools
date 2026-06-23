"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AppFullscreen } from "@/components/AppFullscreen";
import { ChatPanel } from "@/components/ChatPanel";
import { EditorToolbar } from "@/components/EditorToolbar";
import { GenerationTheater } from "@/components/GenerationTheater";
import { LandingView } from "@/components/LandingView";
import { PreviewFrame } from "@/components/PreviewFrame";
import { useTelegram } from "@/components/TelegramProvider";
import {
  createAppId,
  deleteSavedApp,
  getSavedApp,
  saveSavedApp,
  type SavedApp,
} from "@/lib/app-library";
import {
  getCreationScript,
  waitForTheater,
} from "@/lib/creation-theater";
import { isLikelyNetworkError, networkErrorMessage } from "@/lib/network-hint";
import { enrichCustomPrompt } from "@/lib/prompts";
import { applyThemeToHtml, polishGeneratedApp } from "@/lib/apply-theme";
import {
  pickAppVariation,
  variationToPrompt,
  type AppVariation,
} from "@/lib/app-variation";
import {
  flavorToPrompt,
  pickDomainFlavor,
  type DomainFlavor,
} from "@/lib/template-personality";
import { getPrebuiltHtml } from "@/lib/prebuilt";
import {
  pickRandomTheme,
  themeToPrompt,
} from "@/lib/themes";
import {
  SESSION_KEY,
  type SessionData,
  type Template,
} from "@/lib/templates";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Phase = "landing" | "creating" | "editor";

type CreationMeta = {
  title: string;
  emoji: string;
  prompt: string;
  templateId: string | null;
  startTime: number;
  themePrompt: string;
  _theme?: ReturnType<typeof pickRandomTheme>["theme"];
  _extras?: ReturnType<typeof pickRandomTheme>["extras"];
  _variation?: AppVariation;
};

let cachedSession: SessionData | null | undefined;

function readSavedSession(): SessionData | null {
  if (cachedSession !== undefined) return cachedSession;
  if (typeof window === "undefined") {
    cachedSession = null;
    return null;
  }
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      cachedSession = null;
      return null;
    }
    const data = JSON.parse(raw) as SessionData;
    if (!data.html) {
      cachedSession = null;
      return null;
    }
    cachedSession = data;
    return data;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    cachedSession = null;
    return null;
  }
}

function countLines(html: string): number {
  return html.split("\n").length;
}

export function VibeStudio() {
  const {
    isTelegram,
    fullscreenHtml,
    openFullscreen,
    closeFullscreen,
  } = useTelegram();

  const [phase, setPhase] = useState<Phase>("landing");
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState<string | null>(null);
  const [title, setTitle] = useState("моя-штука");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [creationMeta, setCreationMeta] = useState<CreationMeta | null>(null);
  const [aiReady, setAiReady] = useState(false);
  const [createdIn, setCreatedIn] = useState<string | null>(null);
  const [justRevealed, setJustRevealed] = useState(false);
  const [currentAppId, setCurrentAppId] = useState<string | null>(null);
  const [appEmoji, setAppEmoji] = useState("✨");
  const [appTemplateId, setAppTemplateId] = useState<string | null>(null);
  const [libraryRefreshKey, setLibraryRefreshKey] = useState(0);

  const htmlRef = useRef(html);
  const pendingHtmlRef = useRef<string | null>(null);
  const apiPromiseRef = useRef<Promise<string | null> | null>(null);
  const creationErrorRef = useRef<string | null>(null);
  const generateAbortRef = useRef<AbortController | null>(null);
  const userCancelledRef = useRef(false);
  const isTelegramRef = useRef(isTelegram);

  useEffect(() => {
    htmlRef.current = html;
  }, [html]);

  useEffect(() => {
    isTelegramRef.current = isTelegram;
  }, [isTelegram]);

  const persistApp = useCallback(
    (
      id: string,
      data: {
        html: string;
        messages: ChatMessage[];
        title: string;
        emoji: string;
        templateId: string | null;
        createdAt?: number;
      },
    ) => {
      const existing = getSavedApp(id);
      const now = Date.now();
      const app: SavedApp = {
        id,
        html: data.html,
        messages: data.messages,
        title: data.title,
        emoji: data.emoji,
        templateId: data.templateId,
        createdAt: data.createdAt ?? existing?.createdAt ?? now,
        updatedAt: now,
      };
      saveSavedApp(app);
    },
    [],
  );

  useEffect(() => {
    const saved = readSavedSession();
    if (!saved?.html) return;

    const timer = setTimeout(() => {
      let appId = saved.appId ?? null;
      if (!appId) {
        appId = createAppId();
        persistApp(appId, {
          html: saved.html,
          messages: saved.messages ?? [],
          title: saved.title ?? "моя-штука",
          emoji: saved.emoji ?? "✨",
          templateId: saved.templateId ?? null,
        });
        setLibraryRefreshKey((k) => k + 1);
      }
      setHtml(saved.html);
      setMessages(saved.messages ?? []);
      setTitle(saved.title ?? "моя-штука");
      setCurrentAppId(appId);
      setAppEmoji(saved.emoji ?? "✨");
      setAppTemplateId(saved.templateId ?? null);
      setPhase("editor");
    }, 0);

    return () => clearTimeout(timer);
  }, [persistApp]);

  useEffect(() => {
    if (!html || !currentAppId) return;
    const data: SessionData = {
      html,
      messages,
      title,
      appId: currentAppId,
      emoji: appEmoji,
      templateId: appTemplateId,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    persistApp(currentAppId, {
      html,
      messages,
      title,
      emoji: appEmoji,
      templateId: appTemplateId,
    });
  }, [html, messages, title, currentAppId, appEmoji, appTemplateId, persistApp]);

  const finishCreation = useCallback(
    (resultHtml: string, meta: CreationMeta) => {
      const seconds = ((Date.now() - meta.startTime) / 1000).toFixed(1);
      const appId = createAppId();
      const initialMessages: ChatMessage[] = [
        { role: "user", content: meta.prompt.slice(0, 200) },
        {
          role: "assistant",
          content: `Готово! Написал «${meta.title}» — ${countLines(resultHtml)} строк HTML с анимациями и localStorage. Создано за ${seconds} сек. Покликайте в превью →`,
        },
      ];
      setCurrentAppId(appId);
      setAppEmoji(meta.emoji);
      setAppTemplateId(meta.templateId);
      setHtml(resultHtml);
      setRevision((r) => r + 1);
      setTitle(meta.title);
      setCreatedIn(seconds);
      setJustRevealed(true);
      setPhase("editor");
      setMessages(initialMessages);
      persistApp(appId, {
        html: resultHtml,
        messages: initialMessages,
        title: meta.title,
        emoji: meta.emoji,
        templateId: meta.templateId,
      });
      setLibraryRefreshKey((k) => k + 1);
      setTimeout(() => setJustRevealed(false), 2000);
      if (isTelegramRef.current) {
        setTimeout(() => openFullscreen(resultHtml), 100);
      }
    },
    [openFullscreen, persistApp],
  );

  const generate = useCallback(
    async (
      userPrompt: string,
      existingHtml?: string,
      themePrompt?: string,
    ): Promise<string | null> => {
      setLoading(true);
      setError(null);

      const history = existingHtml ? messages : undefined;

      generateAbortRef.current?.abort();
      const ctrl = new AbortController();
      generateAbortRef.current = ctrl;
      const timeoutMs = existingHtml ? 90_000 : 120_000;
      const timer = setTimeout(() => ctrl.abort(), timeoutMs);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: userPrompt,
            existingHtml,
            history,
            themePrompt,
          }),
          signal: ctrl.signal,
        });

        const data = (await res.json()) as {
          html?: string;
          reply?: string;
          error?: string;
        };

        if (!res.ok) {
          const failMessage = data.error ?? "Ошибка генерации";
          if (existingHtml) {
            setMessages((prev) => [
              ...prev,
              { role: "user", content: userPrompt },
              { role: "assistant", content: failMessage },
            ]);
          } else {
            creationErrorRef.current = failMessage;
          }
          throw new Error(failMessage);
        }

        if (data.reply && !data.html) {
          setMessages((prev) => [
            ...prev,
            { role: "user", content: userPrompt },
            { role: "assistant", content: data.reply! },
          ]);
          return null;
        }

        if (!data.html) throw new Error("Пустой ответ от сервера");

        if (existingHtml) {
          setHtml(data.html);
          setRevision((r) => r + 1);
          setMessages((prev) => [
            ...prev,
            { role: "user", content: userPrompt },
            {
              role: "assistant",
              content: "Обновил приложение — смотрите превью →",
            },
          ]);
        }

        return data.html;
      } catch (err) {
        let message =
          err instanceof Error ? err.message : "Не удалось сгенерировать";
        if (userCancelledRef.current) {
          message =
            "Генерация отменена. Выберите готовый шаблон — он собирается сразу, без AI.";
        } else if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          message =
            "Сервер не ответил за 2 минуты. Без VPN Vercel часто недоступен — выберите шаблон или включите VPN.";
        } else if (isLikelyNetworkError(err)) {
          message = networkErrorMessage();
        } else if (
          message.includes("Failed to fetch") ||
          message.includes("NetworkError")
        ) {
          message = networkErrorMessage();
        }
        if (existingHtml) {
          setError(message);
        } else {
          creationErrorRef.current = message;
        }
        return null;
      } finally {
        clearTimeout(timer);
        if (generateAbortRef.current === ctrl) {
          generateAbortRef.current = null;
        }
        setLoading(false);
      }
    },
    [messages],
  );

  const handleTheaterComplete = useCallback(async () => {
    const meta = creationMeta;
    if (!meta) return;

    await waitForTheater(meta.startTime);

    let resultHtml = pendingHtmlRef.current;
    if (!resultHtml && apiPromiseRef.current) {
      resultHtml = (await apiPromiseRef.current) ?? null;
    }

    pendingHtmlRef.current = null;
    apiPromiseRef.current = null;
    setCreationMeta(null);

    if (!resultHtml) {
      setPhase("landing");
      setAiReady(false);
      setError(
        creationErrorRef.current ??
          "Не удалось создать приложение. Попробуйте шаблон или короче опишите идею.",
      );
      creationErrorRef.current = null;
      return;
    }

    creationErrorRef.current = null;
    setAiReady(false);

    let finalHtml = resultHtml;
    if (!meta.templateId && meta._theme && meta._extras && meta._variation) {
      finalHtml = polishGeneratedApp(
        resultHtml,
        meta._theme,
        meta._extras,
        meta._variation,
      );
    }

    finishCreation(finalHtml, meta);
  }, [creationMeta, finishCreation]);

  const buildCreationMeta = (
    base: Omit<CreationMeta, "startTime" | "themePrompt">,
  ): CreationMeta & {
    _theme: ReturnType<typeof pickRandomTheme>["theme"];
    _extras: ReturnType<typeof pickRandomTheme>["extras"];
    _variation: AppVariation;
    _flavor: DomainFlavor | null;
  } => {
    const { theme, extras } = pickRandomTheme();
    const variation = pickAppVariation();
    const flavor = base.templateId ? pickDomainFlavor(base.templateId) : null;
    const flavorPrompt = flavorToPrompt(base.templateId, flavor);
    return {
      ...base,
      startTime: Date.now(),
      themePrompt: `${themeToPrompt(theme, extras)}\n\n${variationToPrompt(variation)}${flavorPrompt ? `\n\n${flavorPrompt}` : ""}`,
      _theme: theme,
      _extras: extras,
      _variation: variation,
      _flavor: flavor,
    };
  };

  const startCreation = (
    base: Omit<CreationMeta, "startTime" | "themePrompt">,
    rawPrebuilt: string | null,
  ) => {
    const meta = buildCreationMeta(base) as CreationMeta & {
      _theme: ReturnType<typeof pickRandomTheme>["theme"];
      _extras: ReturnType<typeof pickRandomTheme>["extras"];
      _variation: AppVariation;
      _flavor: DomainFlavor | null;
    };

    setError(null);
    setAiReady(false);
    creationErrorRef.current = null;
    userCancelledRef.current = false;
    setCreationMeta(meta);

    if (rawPrebuilt) {
      pendingHtmlRef.current = applyThemeToHtml(
        rawPrebuilt,
        meta._theme,
        meta._extras,
        meta._variation,
        meta.templateId,
        meta._flavor,
      );
    } else {
      pendingHtmlRef.current = null;
    }

    setPhase("creating");

    if (!rawPrebuilt) {
      apiPromiseRef.current = generate(
        enrichCustomPrompt(meta.prompt),
        undefined,
        meta.themePrompt,
      )
        .then((result) => {
          if (result) pendingHtmlRef.current = result;
          return result;
        })
        .finally(() => {
          setAiReady(true);
        });
    } else {
      setAiReady(true);
    }
  };

  const cancelCreation = () => {
    userCancelledRef.current = true;
    creationErrorRef.current =
      "Генерация отменена. Выберите готовый шаблон — он собирается сразу, без AI.";
    generateAbortRef.current?.abort();
    setAiReady(true);
  };

  const handleCreate = () => {
    const text = prompt.trim();
    if (!text || phase === "creating") return;

    startCreation(
      {
        title: text.slice(0, 30),
        emoji: "✨",
        prompt: text,
        templateId: null,
      },
      null,
    );
  };

  const handleTemplateAndCreate = (template: Template) => {
    if (phase === "creating") return;

    setSelectedTemplate(template.id);
    setPrompt(template.prompt);

    const prebuilt = getPrebuiltHtml(template.id);
    startCreation(
      {
        title: template.title,
        emoji: template.emoji,
        prompt: template.prompt.split("\n")[0] ?? template.title,
        templateId: template.id,
      },
      prebuilt,
    );
  };

  const handleRefine = async (refinement: string) => {
    const currentHtml = htmlRef.current;
    if (!currentHtml || loading) return;
    await generate(refinement, currentHtml);
  };

  const handleOpenApp = (id: string) => {
    const app = getSavedApp(id);
    if (!app) return;
    setHtml(app.html);
    setMessages(app.messages);
    setTitle(app.title);
    setCurrentAppId(app.id);
    setAppEmoji(app.emoji);
    setAppTemplateId(app.templateId);
    setRevision((r) => r + 1);
    setCreatedIn(null);
    setError(null);
    setPhase("editor");
  };

  const handleDeleteApp = (id: string) => {
    deleteSavedApp(id);
    if (currentAppId === id) {
      handleReset();
    }
    setLibraryRefreshKey((k) => k + 1);
  };

  const handleBackToLibrary = () => {
    setPhase("landing");
    setLibraryRefreshKey((k) => k + 1);
  };

  const handleReset = () => {
    setPrompt("");
    setHtml(null);
    setMessages([]);
    setError(null);
    setSelectedTemplate(null);
    setPhase("landing");
    setTitle("моя-штука");
    setRevision(0);
    setCreatedIn(null);
    setCreationMeta(null);
    setCurrentAppId(null);
    setAppEmoji("✨");
    setAppTemplateId(null);
    pendingHtmlRef.current = null;
    apiPromiseRef.current = null;
    cachedSession = null;
    sessionStorage.removeItem(SESSION_KEY);
  };

  if (phase === "creating" && creationMeta) {
    return (
      <>
        <GenerationTheater
          title={creationMeta.title}
          emoji={creationMeta.emoji}
          userPrompt={creationMeta.prompt}
          script={getCreationScript(creationMeta.templateId)}
          aiGeneration={!creationMeta.templateId}
          aiReady={aiReady}
          onCancel={!creationMeta.templateId ? cancelCreation : undefined}
          onComplete={() => void handleTheaterComplete()}
        />
      </>
    );
  }

  if (phase === "landing") {
    return (
      <LandingView
        prompt={prompt}
        onPromptChange={(value) => {
          setPrompt(value);
          setSelectedTemplate(null);
        }}
        onCreate={handleCreate}
        onTemplate={handleTemplateAndCreate}
        onOpenApp={handleOpenApp}
        onDeleteApp={handleDeleteApp}
        libraryRefreshKey={libraryRefreshKey}
        selectedId={selectedTemplate}
        error={error}
        isTelegram={isTelegram}
      />
    );
  }

  return (
    <>
      {fullscreenHtml && (
        <AppFullscreen
          html={fullscreenHtml}
          appId={currentAppId}
          telegramMode={isTelegram}
          onClose={closeFullscreen}
        />
      )}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-4 pb-36 sm:gap-4 sm:px-4 sm:py-6 sm:pb-28 lg:px-6 lg:pb-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-lg font-bold text-white sm:text-xl">{title}</h1>
            {createdIn && (
              <span className="shrink-0 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                ⚡ {createdIn} сек
              </span>
            )}
          </div>
          <p className="mt-1 hidden text-sm text-white/50 sm:block">
            Приложение сохранено — данные остаются в этом браузере
          </p>
        </div>
        <div className="hidden shrink-0 lg:block">
          <EditorToolbar
            html={html}
            onBack={handleBackToLibrary}
            onNew={handleReset}
            isTelegram={isTelegram}
            onOpenFullscreen={openFullscreen}
          />
        </div>
        <button
          type="button"
          onClick={handleBackToLibrary}
          className="touch-target self-start rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/70 lg:hidden"
        >
          ← Мои
        </button>
      </header>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid min-h-0 grid-cols-1 gap-4 lg:min-h-[520px] lg:grid-cols-2">
        <div className={justRevealed ? "reveal-app reveal-glow order-1 rounded-2xl lg:order-2" : "order-1 lg:order-2"}>
          <PreviewFrame
            html={html}
            title={title}
            appId={currentAppId}
            loading={loading}
            revision={revision}
            isTelegram={isTelegram}
            onOpenFullscreen={openFullscreen}
          />
        </div>
        <div className="order-2 lg:order-1">
          <ChatPanel
            messages={messages}
            onSend={handleRefine}
            loading={loading}
            hasHtml={!!html}
            isInitialGeneration={loading && !html}
          />
        </div>
      </div>

      {html && (
        <div className="mobile-bottom-bar fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#07070f]/95 px-3 py-3 backdrop-blur-md lg:hidden">
          <EditorToolbar
            html={html}
            onBack={handleBackToLibrary}
            onNew={handleReset}
            isTelegram={isTelegram}
            onOpenFullscreen={openFullscreen}
          />
        </div>
      )}
      </div>
    </>
  );
}
