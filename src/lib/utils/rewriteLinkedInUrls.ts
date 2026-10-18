export const LINKEDIN_PROFILE_URL = "https://www.linkedin.com/in/hunain-humail";

const LINKEDIN_PROFILE_URL_PATTERN =
  /(?:https?:\/\/|\/\/)?(?:www\.)?linkedin\.com\/in\/hunain-?humail\/?(?:\?[^\s"'<>)]*)?/gi;

export function rewriteLinkedInUrls(value: string): string {
  return value.replace(
    new RegExp(LINKEDIN_PROFILE_URL_PATTERN.source, "gi"),
    LINKEDIN_PROFILE_URL,
  );
}

export function rewriteLinkedInInTree<T>(value: T): T {
  if (typeof value === "string") {
    return rewriteLinkedInUrls(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => rewriteLinkedInInTree(item)) as T;
  }
  if (value !== null && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      next[key] = rewriteLinkedInInTree(nested);
    }
    return next as T;
  }
  return value;
}
