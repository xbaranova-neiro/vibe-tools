"use client";

import Script from "next/script";

import { initTelegramWebApp } from "@/lib/telegram-env";

export function TelegramScript() {
  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="afterInteractive"
      onLoad={() => {
        initTelegramWebApp();
      }}
    />
  );
}
