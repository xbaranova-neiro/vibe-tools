"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

import {
  initTelegramWebApp,
  isTelegramWebView,
  openInExternalBrowser,
} from "@/lib/telegram-env";

type TelegramContextValue = {
  isTelegram: boolean;
  fullscreenHtml: string | null;
  openFullscreen: (html: string) => void;
  closeFullscreen: () => void;
  openExternal: () => void;
};

const TelegramContext = createContext<TelegramContextValue>({
  isTelegram: false,
  fullscreenHtml: null,
  openFullscreen: () => {},
  closeFullscreen: () => {},
  openExternal: () => {},
});

function detectTelegram(): boolean {
  if (typeof window === "undefined") return false;
  return isTelegramWebView();
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [isTelegram, setIsTelegram] = useState(detectTelegram);
  const [fullscreenHtml, setFullscreenHtml] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (!detectTelegram()) return;
    setIsTelegram(true);
    initTelegramWebApp();
  }, []);

  return (
    <TelegramContext.Provider
      value={{
        isTelegram,
        fullscreenHtml,
        openFullscreen: setFullscreenHtml,
        closeFullscreen: () => setFullscreenHtml(null),
        openExternal: () => openInExternalBrowser(),
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  return useContext(TelegramContext);
}
