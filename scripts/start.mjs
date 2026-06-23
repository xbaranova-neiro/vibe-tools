#!/usr/bin/env node
/** Запуск для Timeweb / VPS: слушает PORT и все интерфейсы */
import { spawn } from "node:child_process";

const port = process.env.PORT || "3000";
const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "start", "-H", "0.0.0.0", "-p", port],
  { stdio: "inherit", env: process.env },
);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
