export const WORK_VIEW_PATH = "/work/view";

export function workDetailHref(
  slug: string,
  knownSlugs?: readonly string[],
): string {
  if (!knownSlugs || knownSlugs.includes(slug)) {
    return `/work/${slug}`;
  }
  return `${WORK_VIEW_PATH}?slug=${encodeURIComponent(slug)}`;
}

export function workSlugFromLocation(
  pathname: string,
  search: string,
): string | null {
  const query = search.startsWith("?") ? search.slice(1) : search;
  const fromQuery = new URLSearchParams(query).get("slug")?.trim() ?? "";
  if (fromQuery.length > 0) {
    return fromQuery;
  }

  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 2 && parts[0] === "work" && parts[1] !== "view") {
    return parts[1] ?? null;
  }

  return null;
}
