import type { Metadata, Viewport } from "next";

import StandaloneAppClient from "../../StandaloneAppClient";

export const metadata: Metadata = {
  title: "Моё приложение",
  appleWebApp: { capable: true, title: "Моё приложение" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

type PageProps = {
  params: Promise<{ payload: string }>;
};

export default async function AppPayloadPage({ params }: PageProps) {
  const { payload } = await params;
  return <StandaloneAppClient pathPayload={payload} />;
}
