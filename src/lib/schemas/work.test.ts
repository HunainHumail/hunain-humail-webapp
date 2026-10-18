import { describe, expect, it } from "vitest";
import { workItemSchema } from "./work";

const valid = {
  id: "work-trinnect",
  slug: "trinnect",
  title: "Trinnect",
  category: "ai-systems",
  summary: "Summary",
  role: "GenAI engineer",
  stack: ["React"],
  highlights: ["One"],
  body: "Body",
  coverUrl: "/projects/trinnect/cover.webp",
  order: 0,
  status: "published",
  featured: true,
  updatedAt: "2026-10-18T00:00:00.000Z",
};

describe("workItemSchema", () => {
  it("accepts a relative cover path", () => {
    expect(workItemSchema.parse(valid).coverUrl).toBe(
      "/projects/trinnect/cover.webp",
    );
  });

  it("rejects a cover that is not a path or https URL", () => {
    const result = workItemSchema.safeParse({
      ...valid,
      coverUrl: "ftp://example.com/cover.webp",
    });
    expect(result.success).toBe(false);
  });

  it("rejects the removed fintech category", () => {
    const result = workItemSchema.safeParse({
      ...valid,
      category: "fintech",
    });
    expect(result.success).toBe(false);
  });
});
