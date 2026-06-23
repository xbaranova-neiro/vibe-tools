import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /** Фикс Turbopack при кириллице в пути папки (локально). На Timeweb путь ASCII — ок. */
  turbopack: {
    root: projectRoot,
  },
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
};

export default nextConfig;
