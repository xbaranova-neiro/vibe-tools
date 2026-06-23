const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3002";

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json };
}

let passed = 0;
let failed = 0;

function assert(name, condition, detail = "") {
  if (condition) {
    passed += 1;
    console.log(`✓ ${name}`);
  } else {
    failed += 1;
    console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

console.log(`Testing API at ${BASE}\n`);

const home = await fetch(`${BASE}/`);
assert("GET / returns 200", home.status === 200, String(home.status));

const empty = await request("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: "" }),
});
assert("POST empty prompt -> 400", empty.status === 400, String(empty.status));

const invalid = await request("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "not-json",
});
assert("POST invalid json handled", invalid.status >= 400, String(invalid.status));

console.log("\nGenerating sample app (may take ~15s)...");
const generated = await request("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "Простой счётчик кликов: кнопка +1 и большое число по центру",
  }),
});

assert(
  "POST generate -> 200",
  generated.status === 200,
  `${generated.status}: ${generated.json.error ?? ""}`,
);
assert(
  "response contains html",
  typeof generated.json.html === "string" && generated.json.html.length > 500,
  `len=${generated.json.html?.length ?? 0}`,
);
assert(
  "html looks valid",
  generated.json.html?.includes("<html") ||
    generated.json.html?.includes("<!DOCTYPE"),
);

if (generated.json.html) {
  const refined = await request("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: "Сделай тёмную тему",
      existingHtml: generated.json.html,
    }),
  });
  assert(
    "POST refine -> 200",
    refined.status === 200,
    `${refined.status}: ${refined.json.error ?? ""}`,
  );
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
