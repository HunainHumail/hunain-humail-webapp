import { describe, expect, it } from "vitest";
import {
  applyPublishedMapping,
  chunkImportWrites,
  planImport,
  prepareCmsDocument,
} from "./importDocs";

function workDoc(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: "work-1",
    slug: "work-1",
    title: "Open finance agent",
    category: "ai-systems",
    summary: "A summary of the case study.",
    role: "GenAI engineer",
    stack: ["TypeScript"],
    highlights: ["Shipped"],
    body: "Details.",
    status: "draft",
    order: 0,
    ...overrides,
  };
}

describe("CMS import planning", () => {
  it("maps published: true to status published", () => {
    expect(applyPublishedMapping({ published: true, title: "A" })).toEqual({
      title: "A",
      status: "published",
    });
    const prepared = prepareCmsDocument(
      "work",
      workDoc({ published: true, status: undefined }),
      "2026-10-19T12:00:00.000Z",
    );
    expect(prepared.data.status).toBe("published");
    expect(prepared.data).not.toHaveProperty("published");
  });

  it("counts created vs updated and chunks commits at 450 writes", () => {
    const documents = [
      workDoc({ id: "work-1", slug: "work-1" }),
      workDoc({ id: "work-2", slug: "work-2", title: "Second" }),
    ];
    const plan = planImport({
      collection: "work",
      documents,
      existingIds: new Set(["work-1"]),
      updatedAt: "2026-10-19T12:00:00.000Z",
    });
    expect(plan.created).toBe(1);
    expect(plan.updated).toBe(1);
    expect(plan.writes).toHaveLength(2);

    const many = Array.from({ length: 451 }, (_, index) => ({
      collection: "work" as const,
      id: `work-${index}`,
      data: { title: `Item ${index}` },
    }));
    const chunks = chunkImportWrites(many);
    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toHaveLength(450);
    expect(chunks[1]).toHaveLength(1);
  });
});
