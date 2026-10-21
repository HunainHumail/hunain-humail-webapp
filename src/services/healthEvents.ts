import { HEALTH_HOUR_MS } from "@/lib/health/limits";
import { healthEventsRepository } from "@/lib/firebase/repositories/healthEventsRepository";
import type { HealthEvent } from "@/lib/schemas/healthEvent";

export async function listHealthEvents(now = Date.now()): Promise<HealthEvent[]> {
  return healthEventsRepository.listRecent(now);
}

export async function countRecentHealthFailures(now = Date.now()): Promise<number> {
  return healthEventsRepository.countSince(now - HEALTH_HOUR_MS);
}
