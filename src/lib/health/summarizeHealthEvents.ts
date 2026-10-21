export type HealthRange = "24h" | "7d";

const HOUR_MS = 60 * 60 * 1000;

export function healthRangeMs(range: HealthRange): number {
  return range === "24h" ? 24 * HOUR_MS : 7 * 24 * HOUR_MS;
}

export function filterHealthEvents<T extends { createdAt: string }>(
  events: readonly T[],
  range: HealthRange,
  now: number,
): T[] {
  const start = now - healthRangeMs(range);
  return events.filter((event) => {
    const time = Date.parse(event.createdAt);
    return !Number.isNaN(time) && time >= start;
  });
}

export function summarizeHealthEvents(
  events: readonly { type: string; source: "client" | "server" }[],
): {
  bySource: { client: number; server: number };
  byType: { type: string; count: number }[];
} {
  const bySource = { client: 0, server: 0 };
  const counts = new Map<string, number>();
  for (const event of events) {
    bySource[event.source] += 1;
    counts.set(event.type, (counts.get(event.type) ?? 0) + 1);
  }
  const byType = [...counts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
  return { bySource, byType };
}

export function healthFailureBannerLabel(count: number): string {
  const noun = count === 1 ? "failure" : "failures";
  return `${count} ${noun} in the last hour`;
}
