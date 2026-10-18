/** Formats a writing `date` (YYYY-MM-DD or ISO) as "Dec 2023" in UTC. */
export function formatWritingDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
