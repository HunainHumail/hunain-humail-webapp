import { describe, expect, it } from "vitest";
import { z } from "zod";
import { profileSchema } from "@/lib/schemas/profile";
import { hydrateDocument, parseDocument, prepareDocument } from "./documentForm";
import { getCollectionConfig } from "./collections";

describe("parseDocument", () => {
  it("drops an empty optional image and stamps updatedAt", () => {
    const prepared = prepareDocument(
      { name: "Hunain", photoUrl: "" },
      [{ name: "photoUrl", label: "Photo", type: "image", optional: true }],
      "2026-10-18T00:00:00.000Z",
    );
    expect(prepared.photoUrl).toBeUndefined();
    expect(prepared.updatedAt).toBe("2026-10-18T00:00:00.000Z");
  });

  it("drops an empty optional rating select", () => {
    const prepared = prepareDocument(
      { name: "Ada", rating: "" },
      [
        {
          name: "rating",
          label: "Rating",
          type: "select",
          optional: true,
          options: [
            { value: "", label: "None" },
            { value: "5", label: "5" },
          ],
        },
      ],
      "2026-10-18T00:00:00.000Z",
    );
    expect(prepared.rating).toBeUndefined();
  });

  it("returns a field error when the document is invalid", () => {
    const config = getCollectionConfig("profile");
    const result = parseDocument(
      profileSchema,
      config.createBlank(),
      config.fields,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeTruthy();
    }
  });

  it("hydrates missing work gallery and links so the editor can show them", () => {
    const config = getCollectionConfig("work");
    const hydrated = hydrateDocument(config.schema, {
      id: "work-trinnect",
      slug: "trinnect",
      title: "Trinnect",
      category: "ai-systems",
      summary: "Summary",
      role: "GenAI engineer",
      stack: ["React"],
      highlights: ["One"],
      body: "Body",
      featured: true,
      order: 0,
      status: "published",
      updatedAt: "2026-10-18T00:00:00.000Z",
    });
    expect(hydrated.gallery).toEqual([]);
    expect(hydrated.links).toEqual([]);
    expect(hydrated.id).toBe("work-trinnect");
  });

  it("parses a valid document", () => {
    const schema = z.object({
      title: z.string().min(1),
      updatedAt: z.string().min(1),
    });
    const result = parseDocument(
      schema,
      { title: "Trinnect" },
      [{ name: "title", label: "Title", type: "text" }],
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.title).toBe("Trinnect");
    }
  });
});
