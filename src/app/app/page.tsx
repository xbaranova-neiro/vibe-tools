import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Моё приложение",
  description: "Мини-приложение из Vibe Tools",
  appleWebApp: {
    capable: true,
    title: "Моё приложение",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export { default } from "./StandaloneAppClient";
