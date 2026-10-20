import { describe, expect, it } from "vitest";
import {
  blueprintLeadSchema,
  blueprintRequestSchema,
  blueprintSpecSchema,
} from "./blueprint";
import { blueprintSampleSpecMobile } from "@/lib/seed/blueprint";

describe("blueprintRequestSchema", () => {
  it("accepts valid input", () => {
    const result = blueprintRequestSchema.safeParse({
      email: "  Ada@Example.COM ",
      idea: "A simple todo app for teams",
      platform: "web",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("ada@example.com");
    }
  });

  it("rejects short idea and invalid email", () => {
    expect(
      blueprintRequestSchema.safeParse({
        email: "not-an-email",
        idea: "short",
        platform: "mobile",
      }).success,
    ).toBe(false);
  });
});

describe("blueprintSpecSchema", () => {
  it("parses seed sample", () => {
    expect(blueprintSpecSchema.safeParse(blueprintSampleSpecMobile).success).toBe(
      true,
    );
  });

  it("rejects a list that has no named rows", () => {
    const raw: unknown = {
      ...blueprintSampleSpecMobile,
      screens: [
        {
          id: "home",
          title: "Nearby",
          purpose: "Pick a shop from barbers that are open today.",
          blocks: [{ type: "list", label: "Shops" }],
        },
        blueprintSampleSpecMobile.screens[1],
        blueprintSampleSpecMobile.screens[2],
      ],
    };
    expect(blueprintSpecSchema.safeParse(raw).success).toBe(false);
  });
});

describe("blueprintLeadSchema", () => {
  it("tolerates partial documents", () => {
    const parsed = blueprintLeadSchema.safeParse({ id: "x1" });
    expect(parsed.success).toBe(true);
  });
});
