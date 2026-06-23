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

/** Открыть во внешнем Safari/Chrome. Hash (#) Telegram часто обрезает — передавайте path-URL. */
export function openInExternalBrowser(url?: string): void {
  const target = url || window.location.href;
  const tg = window.Telegram?.WebApp;

  if (tg?.openLink) {
    tg.openLink(target, { try_instant_view: false });
    return;
  }

  window.open(target, "_blank", "noopener,noreferrer");
}

export const IFRAME_SANDBOX =
  "allow-scripts allow-same-origin allow-forms allow-popups allow-storage-access-by-user-activation";
