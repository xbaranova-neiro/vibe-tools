declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string;
        ready: () => void;
        expand: () => void;
        enableClosingConfirmation: () => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        setHeaderColor?: (color: string) => void;
        setBackgroundColor?: (color: string) => void;
        close: () => void;
      };
    };
  }
}

export function isTelegramWebView(): boolean {
  if (typeof window === "undefined") return false;
  if (window.Telegram?.WebApp?.initData) return true;
  return /Telegram/i.test(navigator.userAgent);
}

export function initTelegramWebApp(): boolean {
  const tg = window.Telegram?.WebApp;
  if (!tg) return false;

  tg.ready();
  tg.expand();
  tg.enableClosingConfirmation();

  try {
    tg.setHeaderColor?.("#07070f");
    tg.setBackgroundColor?.("#07070f");
  } catch {
    /* optional API */
  }

  return true;
}

/** Открыть текущий сайт во внешнем Safari/Chrome — там сохранение и превью работают. */
export function openInExternalBrowser(url?: string): void {
  const target = url || window.location.href;
  const tg = window.Telegram?.WebApp;

  if (tg?.openLink) {
    tg.openLink(target);
    return;
  }

  window.open(target, "_blank", "noopener,noreferrer");
}

export const IFRAME_SANDBOX =
  "allow-scripts allow-same-origin allow-forms allow-popups allow-storage-access-by-user-activation";
