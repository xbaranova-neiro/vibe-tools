"use client";

import { createContext, useContext, useEffect, useState } from "react";

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

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [isTelegram, setIsTelegram] = useState(false);
  const [fullscreenHtml, setFullscreenHtml] = useState<string | null>(null);

  useEffect(() => {
    const detect = () => {
      if (isTelegramWebView()) {
        setIsTelegram(true);
        initTelegramWebApp();
      }
    };

    detect();
    const t = window.setTimeout(detect, 300);
    return () => window.clearTimeout(t);
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
