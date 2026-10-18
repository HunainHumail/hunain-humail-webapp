const SCHEME_HREF = /^(?:https?:\/\/|mailto:|tel:)/i;
const BARE_HOST = /^(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:[/?#]|$)/i;

export function resolveExternalHref(href: string): string | null {
  const value = href.trim();
  if (value.startsWith("//")) {
    return `https:${value}`;
  }
  if (SCHEME_HREF.test(value)) {
    return value;
  }
  if (BARE_HOST.test(value)) {
    return `https://${value}`;
  }
  return null;
}
