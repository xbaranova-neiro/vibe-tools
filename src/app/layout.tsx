import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { TelegramProvider } from "@/components/TelegramProvider";
import { TelegramScript } from "@/components/TelegramScript";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Vibe Tools — сделай полезную штуку за минуту",
  description:
    "Вайб-кодинг на практике: опиши идею и получи готовое мини-приложение — трекер, калькулятор, список.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TelegramScript />
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}
