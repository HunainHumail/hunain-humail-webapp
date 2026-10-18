import { describe, expect, it } from "vitest";
import { z } from "zod";
import { profileSchema } from "@/lib/schemas/profile";
import { parseDocument, prepareDocument } from "./documentForm";
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
