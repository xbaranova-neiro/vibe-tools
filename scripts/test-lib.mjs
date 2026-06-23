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

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
