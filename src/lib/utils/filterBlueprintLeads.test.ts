import { describe, expect, it } from "vitest";
import type { BlueprintLead } from "@/lib/schemas/blueprint";
import { filterBlueprintLeads } from "./filterBlueprintLeads";

const lead = (overrides: Partial<BlueprintLead>): BlueprintLead => ({
  id: "1",
  email: "a@example.com",
  idea: "idea text long enough",
  platform: "mobile",
  generationStatus: "success",
  modelId: "m",
  usage: { inputTokens: 1, outputTokens: 2 },
  createdAt: "2026-01-15T12:00:00.000Z",
  ipHash: "abc",
  status: "new",
  ...overrides,
});

describe("filterBlueprintLeads", () => {
  it("filters by status and date without mutating input", () => {
    const items = [
      lead({ id: "1", status: "new" }),
      lead({ id: "2", status: "contacted" }),
    ];
    const copy = [...items];
    const filtered = filterBlueprintLeads(items, {
      status: "contacted",
      from: "2026-01-01",
      to: "2026-01-31",
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe("2");
    expect(items).toEqual(copy);
  });
});
