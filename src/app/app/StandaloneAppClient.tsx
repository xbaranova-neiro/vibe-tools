"use client";

import { useEffect } from "react";

/** Legacy /app#payload → /api/view/payload */
export default function StandaloneAppClient() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      window.location.replace(`/api/view/${encodeURIComponent(hash)}`);
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07070f]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
    </div>
  );
}
