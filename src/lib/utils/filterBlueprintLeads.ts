import type {
  BlueprintLead,
  BlueprintLeadStatus,
} from "@/lib/schemas/blueprint";

export interface BlueprintLeadFilters {
  status: "all" | BlueprintLeadStatus;
  from?: string;
  to?: string;
}

function dayStart(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00.000Z`).getTime();
}

function dayEnd(isoDate: string): number {
  return new Date(`${isoDate}T23:59:59.999Z`).getTime();
}

export function filterBlueprintLeads(
  items: readonly BlueprintLead[],
  filters: BlueprintLeadFilters,
): BlueprintLead[] {
  return items.filter((item) => {
    if (filters.status !== "all" && item.status !== filters.status) {
      return false;
    }
    if (!item.createdAt) {
      return filters.from === undefined && filters.to === undefined;
    }
    const created = new Date(item.createdAt).getTime();
    if (filters.from && created < dayStart(filters.from)) {
      return false;
    }
    if (filters.to && created > dayEnd(filters.to)) {
      return false;
    }
    return true;
  });
}
