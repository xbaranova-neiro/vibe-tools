export function extractHtml(raw: string): string {
  const trimmed = raw.trim();

  const fencedMatch = trimmed.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const doctypeIndex = trimmed.search(/<!DOCTYPE\s+html/i);
  if (doctypeIndex >= 0) {
    return trimmed.slice(doctypeIndex).trim();
  }

  const htmlIndex = trimmed.search(/<html[\s>]/i);
  if (htmlIndex >= 0) {
    return trimmed.slice(htmlIndex).trim();
  }

  return trimmed;
}

export function sanitizeHtml(html: string): string {
  let result = html;

  result = result.replace(
    /<script[^>]*\ssrc\s*=\s*["'][^"']+["'][^>]*>\s*<\/script>/gi,
    "",
  );
  result = result.replace(
    /<script[^>]*\ssrc\s*=\s*["'][^"']+["'][^>]*\/>/gi,
    "",
  );

  result = result.replace(
    /<img\b[^>]*\ssrc\s*=\s*["']https?:\/\/[^"']+["'][^>]*\/?>/gi,
    '<span style="font-size:2rem;line-height:1" aria-hidden="true">🛒</span>',
  );

  return result;
}

export function isValidGeneratedHtml(html: string): boolean {
  return (
    html.includes("<html") ||
    html.includes("<!DOCTYPE") ||
    html.includes("<!doctype")
  );
}
