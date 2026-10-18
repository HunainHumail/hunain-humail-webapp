export const FALLBACK_SITE_URL = "http://localhost:3000";

export function normalizeSiteUrl(siteUrl: string): string {
  try {
    const url = new URL(siteUrl.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return FALLBACK_SITE_URL;
    }
    const path = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${path}`;
  } catch {
    return FALLBACK_SITE_URL;
  }
}
