"use client";

type HomeScreenGuideProps = {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  busy?: boolean;
};

const STEPS = [
  {
    n: "1",
    title: "Откроется Safari",
    desc: "Вы увидите своё приложение — с кнопками, можно потыкать.",
  },
  {
    n: "2",
    title: "Нажмите «Поделиться»",
    desc: "Внизу Safari — квадрат со стрелкой вверх (□↑).",
  },
  {
    n: "3",
    title: "«На экран «Домой»»",
    desc: "Прокрутите меню вниз и выберите этот пункт.",
  },
  {
    n: "4",
    title: "«Добавить»",
    desc: "Справа вверху — и иконка появится на рабочем столе.",
  },
];

export function HomeScreenGuide({
  open,
  onClose,
  onContinue,
  busy,
}: HomeScreenGuideProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className="safe-bottom w-full max-w-md overflow-hidden rounded-2xl border border-violet-400/30 bg-[#0d0d18] shadow-2xl"
        role="dialog"
        aria-labelledby="home-guide-title"
      >
        <div className="border-b border-white/10 bg-violet-500/10 px-4 py-4 sm:px-5">
          <h2
            id="home-guide-title"
            className="text-lg font-bold text-white sm:text-xl"
          >
            📱 Как добавить на экран «Домой»
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-white/60">
            Так приложение откроется как обычная иконка — без Safari и
            интернета.
          </p>
        </div>

        <ol className="space-y-3 px-4 py-4 sm:px-5">
          {STEPS.map((step) => (
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
          <p className="mb-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2.5 text-xs leading-relaxed text-amber-100/90">
            <strong>Важно:</strong> добавляйте ярлык, когда видите{" "}
            <strong>само приложение</strong> (трекер, кнопки), а не пустую
            страницу. Сначала откроется Safari — потом «Поделиться».
          </p>
          <button
            type="button"
            onClick={onContinue}
            disabled={busy}
            className="touch-target w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 text-base font-semibold text-white shadow-lg disabled:opacity-60"
          >
            {busy ? "Открываем…" : "Открыть в Safari →"}
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
