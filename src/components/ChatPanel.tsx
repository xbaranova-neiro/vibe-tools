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
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Доработка</h3>
        <p className="text-xs text-white/50">
          {isInitialGeneration
            ? "ИИ создаёт первую версию…"
            : hasHtml
              ? "Опишите что изменить"
              : "Сначала создайте приложение"}
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-white/40">
            Например: «Добавь тёмную тему» или «Сделай крупнее кнопки»
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-xl px-3 py-2 text-sm ${
              msg.role === "user"
                ? "ml-4 bg-violet-500/20 text-violet-100"
                : "mr-4 bg-white/10 text-white/80"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="mr-4 rounded-xl bg-white/10 px-3 py-2 text-sm text-white/60">
            Генерирую…
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <input
            name="refine"
            type="text"
            disabled={!hasHtml || loading}
            placeholder="Добавь график расходов…"
            className="flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-400 disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={!hasHtml || loading}
            className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>
      </form>
    </div>
  );
}
