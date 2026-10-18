/** Formats an ISO timestamp as "Updated Oct 2026" (UTC month + year). */
export function formatUpdatedMonthYear(iso: string): string {
  const date = new Date(iso);
  const monthYear = date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return `Updated ${monthYear}`;
}

export function latestUpdatedAtIso(items: { updatedAt: string }[]): string {
  if (items.length === 0) {
    return new Date(0).toISOString();
  }
  return items.reduce((latest, item) =>
    item.updatedAt > latest ? item.updatedAt : latest,
  items[0].updatedAt);
}
