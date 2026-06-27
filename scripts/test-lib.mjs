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

function isClearRefineRequest(message) {
  const t = message.trim();
  if (t.length < 3) return false;
  if (/^(как|что|можно\s+ли|зачем|почему|где|куда|когда|сколько|explain|how|what|why)\b/i.test(t)) return false;
  if (/^(привет|здравств|спасибо|благодар|окей|ок$|понятно|hello|hi)\b/i.test(t)) return false;
  const refineVerbs = /(добав\w*|убери\w*|удали\w*|измени\w*|сделай\w*|исправ\w*|поменя\w*|передел\w*|увелич\w*|уменьш\w*|замени\w*|встав\w*|скрой\w*|покажи\w*|укрупн\w*|потемн\w*|посветл\w*|перенес\w*|перестав\w*|убрать|добавить|изменить|исправить|перекрась\w*|перекрас\w*)/i;
  const refineTargets = /(тем\w*|тёмн\w*|темн\w*|светл\w*|кнопк\w*|фон\w*|шрифт\w*|анимац\w*|график\w*|иконк\w*|список\w*|пол\w*|форм\w*|цвет\w*|стил\w*|размер\w*|отступ\w*|прогресс\w*|счётчик\w*|счетчик\w*|назван\w*|текст\w*|градиент\w*|обводк\w*|акцент\w*|ярч\w*|бледн\w*|контраст\w*)/i;
  const colorThemeOnly = /(цвет\w*|тем\w*|тёмн\w*|темн\w*|светл\w*|фон\w*|градиент\w*|ярч\w*|бледн\w*|акцент\w*|palette|dark|light|theme)/i;
  if (refineVerbs.test(t)) return true;
  if (refineTargets.test(t) && t.length >= 8) return true;
  if (colorThemeOnly.test(t) && t.length >= 6) return true;
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

assert("refine: поменяй цвета", isClearRefineRequest("поменяй цвета на синие"));
assert("refine: сделай тёмную тему", isClearRefineRequest("сделай тёмную тему"));
assert("refine: синий фон", isClearRefineRequest("синий фон"));
assert("refine: not vague улучши", !isClearRefineRequest("улучши"));
assert("refine: not question", !isClearRefineRequest("как сохранить"));
assert(
  "strip theme removes vibe-theme",
  !stripStudioLayers('<style data-vibe-theme="x">body{background:red!important}</style><body></body>').includes("vibe-theme"),
);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
