"use client";

import { useEffect, useRef, useState } from "react";

import type { CreationScript } from "@/lib/creation-theater";

type GenerationTheaterProps = {
  title: string;
  emoji: string;
  userPrompt: string;
  script: CreationScript;
  aiGeneration?: boolean;
  aiReady?: boolean;
  onComplete?: () => void;
};

export function GenerationTheater({
  title,
  emoji,
  userPrompt,
  script,
  aiGeneration = false,
  aiReady = false,
  onComplete,
}: GenerationTheaterProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [codeIndex, setCodeIndex] = useState(0);
  const [typedCode, setTypedCode] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const waitingForAi = aiGeneration && !aiReady;
  const completedRef = useRef(false);

  useEffect(() => {
    const t0 = Date.now();
    const tick = setInterval(() => setElapsed((Date.now() - t0) / 1000), 100);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((i) => {
        if (i >= script.steps.length - 1) {
          clearInterval(stepTimer);
          return i;
        }
        return i + 1;
      });
    }, 480);
    return () => clearInterval(stepTimer);
  }, [script.steps.length]);

  useEffect(() => {
    const line = script.codeLines[codeIndex];
    if (!line) return;

    let char = 0;
    let cancelled = false;

    const typeTimer = setInterval(() => {
      if (cancelled) return;
      char += 1;
      setTypedCode(line.slice(0, char));
      if (char >= line.length) {
        clearInterval(typeTimer);
        setTimeout(() => {
          if (!cancelled) setCodeIndex((i) => i + 1);
        }, 180);
      }
    }, 12);

    return () => {
      cancelled = true;
      clearInterval(typeTimer);
    };
  }, [codeIndex, script.codeLines]);

  useEffect(() => {
    if (
      stepIndex >= script.steps.length - 1 &&
      codeIndex >= script.codeLines.length
    ) {
      if (aiGeneration && !aiReady) return;
      const t = setTimeout(() => {
        if (completedRef.current) return;
        completedRef.current = true;
        setDone(true);
        onComplete?.();
      }, 450);
      return () => clearTimeout(t);
    }
  }, [stepIndex, codeIndex, script, onComplete, aiGeneration, aiReady]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-[#07070f]/95 backdrop-blur-md sm:items-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-violet-600/20 blur-3xl animate-pulse sm:h-48 sm:w-48" />
        <div className="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-fuchsia-600/15 blur-3xl animate-pulse sm:h-48 sm:w-48" />
      </div>

      <div className="safe-top safe-bottom safe-x relative w-full max-w-lg animate-[fadeUp_.4s_ease-out] py-4 sm:py-0">
        <div className="mb-3 text-center sm:mb-4">
          <div className="mb-1.5 text-3xl sm:mb-2 sm:text-4xl">{emoji}</div>
          <h2 className="text-lg font-bold text-white sm:text-xl">
            {waitingForAi
              ? "Нейросеть пишет код…"
              : done
                ? "✨ Готово!"
                : "Создаю приложение…"}
          </h2>
          {waitingForAi && (
            <p className="mt-1.5 text-xs text-white/45 sm:mt-2">
              Обычно 15–40 сек
            </p>
          )}
          <p className="mt-1 text-sm text-white/50">{title}</p>
          <p className="mx-auto mt-2 max-w-sm rounded-lg bg-white/5 px-3 py-1.5 text-[11px] text-violet-200/90 sm:text-xs">
            «{userPrompt.slice(0, 72)}
            {userPrompt.length > 72 ? "…" : ""}»
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
              Процесс
            </p>
            <ul className="mobile-scroll max-h-[140px] space-y-1.5 overflow-y-auto sm:max-h-none">
              {script.steps.map((step, i) => (
                <li
                  key={step}
                  className={`flex items-center gap-2 text-xs transition-all duration-200 ${
                    i <= stepIndex ? "text-white" : "text-white/25"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] sm:text-xs ${
                      i < stepIndex
                        ? "bg-emerald-500/30 text-emerald-300"
                        : i === stepIndex
                          ? "animate-pulse bg-violet-500/40 text-violet-200"
                          : "bg-white/10 text-white/30"
                    }`}
                  >
                    {i < stepIndex ? "✓" : i + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-violet-500/20 bg-[#0d1117] p-3 font-mono text-[11px] shadow-inner shadow-violet-500/10 sm:text-xs">
            <div className="mb-1.5 flex items-center gap-2 text-[10px] text-white/40">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="ml-2">app.html</span>
            </div>
            <pre className="min-h-[56px] overflow-hidden text-emerald-400/90 sm:min-h-[72px]">
              <code>
                {typedCode}
                <span className="animate-pulse text-violet-400">|</span>
              </code>
            </pre>
          </div>
        </div>

        <div className="mt-3 sm:mt-4">
          <div className="mb-1.5 flex justify-between text-[10px] text-white/40">
            <span>
              {waitingForAi
                ? "Жду OpenAI…"
                : done
                  ? "Собрано"
                  : "Генерация…"}
            </span>
            <span>{elapsed.toFixed(1)} сек</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300 ease-out${waitingForAi ? " animate-pulse" : ""}`}
              style={{
                width: waitingForAi
                  ? "92%"
                  : `${Math.min(100, ((stepIndex + 1) / script.steps.length) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
