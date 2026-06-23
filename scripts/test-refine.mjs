const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3010";

async function generate(body) {
  const res = await fetch(`${BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, ...(await res.json()) };
}

const first = await generate({
  prompt:
    "Трекер привычки пить воду: цель 8 стаканов в день, кнопки добавить/убрать стакан, прогресс-бар",
});

console.log("first status", first.status, "len", first.html?.length);

const second = await generate({
  prompt: "добавь ещё визуализацию стаканов, сделай градацию по дням",
  existingHtml: first.html,
});

console.log("second status", second.status, "len", second.html?.length);
console.log("identical", first.html?.trim() === second.html?.trim());
console.log("has glasses viz", /стакан|glass|🥤|💧/i.test(second.html ?? ""));
