"use client";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatPanelProps = {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  loading?: boolean;
  hasHtml?: boolean;
  isInitialGeneration?: boolean;
};

export function ChatPanel({
  messages,
  onSend,
  loading,
  hasHtml,
  isInitialGeneration,
}: ChatPanelProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("refine") as HTMLInputElement;
    const value = input.value.trim();
    if (!value || loading) return;
    onSend(value);
    input.value = "";
  };

  return (
    <div className="flex max-h-[38dvh] min-h-[200px] flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:max-h-[42dvh] sm:min-h-[240px] lg:max-h-none lg:min-h-[520px] lg:h-full">
      <div className="shrink-0 border-b border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
        <h3 className="text-sm font-semibold text-white">Доработка</h3>
        <p className="text-xs text-white/50">
          {isInitialGeneration
            ? "Создаёт первую версию…"
            : hasHtml
              ? "Опишите что изменить"
              : "Сначала создайте приложение"}
        </p>
      </div>

      <div className="mobile-scroll min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3 sm:space-y-3 sm:p-4">
        {messages.length === 0 && (
          <p className="text-sm text-white/40">
            «Добавь тёмную тему» · «Сделай крупнее кнопки»
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[95%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
              msg.role === "user"
                ? "ml-auto bg-violet-500/20 text-violet-100"
                : "mr-auto bg-white/10 text-white/80"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="mr-auto max-w-[95%] rounded-xl bg-white/10 px-3 py-2 text-sm text-white/60">
            Генерирую…
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-white/10 p-2.5 sm:p-3"
      >
        <div className="flex gap-2">
          <input
            name="refine"
            type="text"
            disabled={!hasHtml || loading}
            placeholder="Добавь график…"
            className="touch-target flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-base text-white placeholder:text-white/30 outline-none focus:border-violet-400 disabled:opacity-40 sm:text-sm"
          />
          <button
            type="submit"
            disabled={!hasHtml || loading}
            className="touch-target shrink-0 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>
      </form>
    </div>
  );
}
