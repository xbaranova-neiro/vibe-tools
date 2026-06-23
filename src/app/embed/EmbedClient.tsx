"use client";

import { useEffect, useState } from "react";

import { decodeHtmlPayload } from "@/lib/html-payload";
import { installHtmlDocument } from "@/lib/install-html-document";

export default function EmbedClient() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        setError("Нет данных приложения");
        return;
      }

      const html = await decodeHtmlPayload(hash);
      if (!html) {
        setError("Не удалось загрузить приложение");
        return;
      }

      try {
        installHtmlDocument(html);
      } catch {
        setError("Ошибка отображения");
      }
    };

    void load();
  }, []);

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "system-ui,sans-serif",
          background: "#07070f",
          color: "#fff",
          textAlign: "center",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#07070f",
        color: "#fff",
        fontFamily: "system-ui,sans-serif",
      }}
    >
      Загрузка…
    </div>
  );
}
