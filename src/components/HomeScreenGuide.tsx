"use client";

import { getMobilePlatform, type MobilePlatform } from "@/lib/device";

type HomeScreenGuideProps = {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  busy?: boolean;
};

const IOS_STEPS = [
  {
    n: "1",
    title: "Откроется Safari с вашим приложением",
    desc: "Трекер или список — с рабочими кнопками. Это страница в интернете, не файл.",
  },
  {
    n: "2",
    title: "Внизу Safari — «Поделиться»",
    desc: "Кнопка в центре: квадрат со стрелкой вверх □↑",
  },
  {
    n: "3",
    title: "«На экран «Домой»»",
    desc: "Прокрутите список вниз — пункт с плюсом.",
  },
  {
    n: "4",
    title: "«Добавить»",
    desc: "Справа вверху. На рабочем столе появится иконка ✨",
  },
];

const ANDROID_STEPS = [
  {
    n: "1",
    title: "Откроется Chrome с вашим приложением",
    desc: "С рабочими кнопками и прокруткой — как мини-приложение.",
  },
  {
    n: "2",
    title: "Меню ⋮ справа вверху",
    desc: "Три точки в углу Chrome.",
  },
  {
    n: "3",
    title: "«Добавить на главный экран»",
    desc: "Или «Установить приложение» — название зависит от версии Chrome.",
  },
  {
    n: "4",
    title: "«Добавить»",
    desc: "На главном экране появится иконка ✨ — открывается одним тапом.",
  },
];

function platformCopy(platform: MobilePlatform) {
  if (platform === "android") {
    return {
      steps: ANDROID_STEPS,
      intro:
        "На Android файл HTML и ярлык на главном экране — разные вещи. Ярлык работает как приложение.",
      fileLabel: "💾 Файл HTML",
      filePoints: [
        "✓ Открыть в браузере",
        "✗ Иконки на экране нет",
        "✗ Как приложение хуже",
      ],
      homeLabel: "📱 Главный экран",
      homePoints: [
        "✓ Иконка на экране",
        "✓ Открывается одним тапом",
        "✓ Как мини-приложение",
      ],
      tip: (
        <>
          Сначала откроется Chrome с приложением.{" "}
          <strong>Только оттуда</strong> — меню ⋮ → «Добавить на главный экран».
        </>
      ),
      continueLabel: "Открыть в Chrome →",
    };
  }

  return {
    steps: IOS_STEPS,
    intro:
      "На iPhone это не то же самое, что файл в «Файлах».",
    fileLabel: "💾 Файл в «Файлах»",
    filePoints: [
      "✓ Открыть через Safari",
      "✗ Иконки на экране нет",
      "✗ Как приложение не работает",
    ],
    homeLabel: "📱 Экран «Домой»",
    homePoints: [
      "✓ Иконка на рабочем столе",
      "✓ Открывается одним тапом",
      "✓ Как мини-приложение",
    ],
    tip: (
      <>
        Сначала откроется Safari с приложением.{" "}
        <strong>Только оттуда</strong> — «Поделиться» → «На экран «Домой»».
        Из «Файлов» так сделать нельзя — это ограничение iPhone.
      </>
    ),
    continueLabel: "Открыть в Safari →",
  };
}

export function HomeScreenGuide({
  open,
  onClose,
  onContinue,
  busy,
}: HomeScreenGuideProps) {
  if (!open) return null;

  const platform = getMobilePlatform();
  const copy = platformCopy(platform);

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className="safe-bottom mobile-scroll max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-violet-400/30 bg-[#0d0d18] shadow-2xl"
        role="dialog"
        aria-labelledby="home-guide-title"
      >
        <div className="border-b border-white/10 bg-violet-500/10 px-4 py-4 sm:px-5">
          <h2
            id="home-guide-title"
            className="text-lg font-bold text-white sm:text-xl"
          >
            📱 Иконка на экране — как приложение
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            {copy.intro}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 px-4 pt-4 text-xs sm:px-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="font-semibold text-white/90">{copy.fileLabel}</p>
            <ul className="mt-2 space-y-1 text-white/50">
              {copy.filePoints.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 p-3">
            <p className="font-semibold text-violet-100">{copy.homeLabel}</p>
            <ul className="mt-2 space-y-1 text-violet-200/70">
              {copy.homePoints.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="space-y-3 px-4 py-4 sm:px-5">
          {copy.steps.map((step) => (
            <li key={step.n} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/30 text-sm font-bold text-violet-200">
                {step.n}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{step.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/55">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="border-t border-white/10 bg-white/[0.02] px-4 py-4 sm:px-5">
          <p className="mb-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 text-xs leading-relaxed text-emerald-100/90">
            {copy.tip}
          </p>
          <button
            type="button"
            onClick={onContinue}
            disabled={busy}
            className="touch-target w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-base font-semibold text-white shadow-lg disabled:opacity-60"
          >
            {busy ? "Готовим ссылку…" : copy.continueLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="touch-target mt-2 w-full py-2.5 text-sm text-white/45"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
