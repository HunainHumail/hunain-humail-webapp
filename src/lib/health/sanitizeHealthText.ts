const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const SECRET_PATTERN =
  /\b(?:api[_-]?key|bearer|token|secret|password)\b\s*[:=]\s*\S+/gi;

export function sanitizeHealthText(
  value: string,
  max: number,
  redact: readonly string[] = [],
): string {
  let next = value;
  for (const secret of redact) {
    const trimmed = secret.trim();
    if (trimmed.length < 4) {
      continue;
    }
    next = next.split(trimmed).join(" ");
  }
  next = next
    .replace(EMAIL_PATTERN, " ")
    .replace(SECRET_PATTERN, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (next.length > max) {
    next = next.slice(0, max).trim();
  }
  return next;
}
