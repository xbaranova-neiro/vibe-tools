function extractHtml(raw) {
  const trimmed = raw.trim();
  const fencedMatch = trimmed.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) return fencedMatch[1].trim();
  const doctypeIndex = trimmed.search(/<!DOCTYPE\s+html/i);
  if (doctypeIndex >= 0) return trimmed.slice(doctypeIndex).trim();
  const htmlIndex = trimmed.search(/<html[\s>]/i);
  if (htmlIndex >= 0) return trimmed.slice(htmlIndex).trim();
  return trimmed;
}

function sanitizeHtml(html) {
  return html
    .replace(/<script[^>]*\ssrc\s*=\s*["'][^"']+["'][^>]*>\s*<\/script>/gi, "")
    .replace(/<script[^>]*\ssrc\s*=\s*["'][^"']+["'][^>]*\/>/gi, "")
    .replace(
      /<img\b[^>]*\ssrc\s*=\s*["']https?:\/\/[^"']+["'][^>]*\/?>/gi,
      '<span style="font-size:2rem;line-height:1" aria-hidden="true">🛒</span>',
    );
}

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    passed += 1;
    console.log(`✓ ${name}`);
  } else {
    failed += 1;
    console.error(`✗ ${name}`);
  }
}

assert(
  "extracts fenced html",
  extractHtml("```html\n<!DOCTYPE html><html></html>\n```").includes("<html"),
);
assert(
  "extracts raw html",
  extractHtml("<!DOCTYPE html><html><body>ok</body></html>").startsWith("<!DOCTYPE"),
);
assert(
  "sanitizes external scripts",
  !sanitizeHtml('<script src="https://evil.com/a.js"></script>').includes("evil.com"),
);
assert(
  "preserves onclick handlers",
  sanitizeHtml('<button onclick="add()">ok</button>').includes("onclick"),
);
assert(
  "replaces external images with emoji",
  sanitizeHtml('<img src="https://example.com/a.jpg" alt="x">').includes("🛒"),
);

const REFINE_ACTION =
  /(добав\w*|убер\w*|удал\w*|измен\w*|сдел\w*|исправ\w*|помен\w*|передел\w*|увелич\w*|уменьш\w*|замен\w*|встав\w*|скрой\w*|покаж\w*|улучш\w*|доработ\w*|обнов\w*|почин\w*|перекрас\w*|украс\w*|укрупн\w*|потемн\w*|посветл\w*|перенес\w*|перестав\w*|убрать|добавить|изменить|исправить|fix|add|remove|change|update|make)/i;

function isChatOnlyRefineMessage(message) {
  const t = message.trim();
  if (t.length < 3) return true;
  if (/^(привет|здравств|спасибо|благодар|понятно|hello|hi|hey|окей|ок)$/i.test(t)) return true;
  if (/^(как|зачем|почему|how|why)\s/i.test(t) && !REFINE_ACTION.test(t)) return true;
  if (/^(что такое|что значит|что умеет|что делает|what is)\s/i.test(t)) return true;
  if (/^(сколько|когда|где)\s/i.test(t) && !REFINE_ACTION.test(t)) return true;
  if (/\?\s*$/.test(t) && !REFINE_ACTION.test(t)) return true;
  return false;
}

function stripStudioLayers(html) {
  let result = html;
  result = result.replace(/<style data-vibe-theme="[^"]*">[\s\S]*?<\/style>/gi, "");
  result = result.replace(/<style data-vibe-variation>[\s\S]*?<\/style>/gi, "");
  result = result.replace(/<style data-vibe-polish>[\s\S]*?<\/style>/gi, "");
  result = result.replace(/<script data-vibe-polish>[\s\S]*?<\/script>/gi, "");
  result = result.replace(/<style data-vibe-personality>[\s\S]*?<\/style>/gi, "");
  result = result.replace(/<script data-vibe-personality>[\s\S]*?<\/script>/gi, "");
  return result;
}

assert("refine html: поменяй цвета", !isChatOnlyRefineMessage("поменяй цвета на синие"));
assert("refine html: улучши", !isChatOnlyRefineMessage("улучши"));
assert("refine html: не нравится", !isChatOnlyRefineMessage("не нравится дизайн"));
assert("refine html: синий фон", !isChatOnlyRefineMessage("синий фон"));
assert("chat only: как сохранить", isChatOnlyRefineMessage("как сохранить"));
assert("chat only: привет", isChatOnlyRefineMessage("привет"));
assert(
  "strip theme removes vibe-theme",
  !stripStudioLayers('<style data-vibe-theme="x">body{background:red!important}</style><body></body>').includes("vibe-theme"),
);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
