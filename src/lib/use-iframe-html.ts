"use client";

import { useEffect, useRef } from "react";

import { encodeHtmlPayload } from "@/lib/html-payload";
import { prepareHtmlForPreview } from "@/lib/prepare-html-for-preview";
import { IFRAME_SANDBOX } from "@/lib/telegram-env";

type UseIframeHtmlOptions = {
  html: string | null;
  revision?: number;
  /** Telegram WebView: same-origin /embed, blob и srcdoc не работают. */
  telegramMode?: boolean;
};

export function useIframeHtml({
  html,
  revision = 0,
  telegramMode = false,
}: UseIframeHtmlOptions) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !html) return;

    let cancelled = false;
    const prepared = prepareHtmlForPreview(html);

    const cleanupBlob = () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };

    const writeToIframe = (): boolean => {
      try {
        const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
        if (!doc) return false;
        iframe.removeAttribute("src");
        doc.open();
        doc.write(prepared);
        doc.close();
        return true;
      } catch {
        return false;
      }
    };

    if (telegramMode) {
      cleanupBlob();
      iframe.removeAttribute("srcdoc");
      iframe.removeAttribute("sandbox");

      void encodeHtmlPayload(html).then((payload) => {
        if (cancelled) return;
        iframe.src = `/embed#${payload}`;
      });

      return () => {
        cancelled = true;
      };
    }

    cleanupBlob();
    iframe.removeAttribute("src");
    iframe.removeAttribute("srcdoc");
    iframe.setAttribute("sandbox", IFRAME_SANDBOX);

    if (writeToIframe()) {
      return cleanupBlob;
    }

    iframe.srcdoc = prepared;

    return cleanupBlob;
  }, [html, revision, telegramMode]);

  return iframeRef;
}
