import { describe, expect, it } from "vitest";
import { blueprintSpecSchema } from "@/lib/schemas/blueprint";
import { blueprintContentSeed } from "./blueprint";

const BANNED = /study|learning|course|certif|hysab|cto-level/i;

describe("blueprintContentSeed", () => {
  it("parses sample spec and example lengths", () => {
    expect(blueprintSpecSchema.safeParse(blueprintContentSeed.sample).success).toBe(
      true,
    );
    expect(blueprintContentSeed.examples).toHaveLength(3);
    for (const example of blueprintContentSeed.examples) {
      expect(example.length).toBeGreaterThanOrEqual(10);
      expect(example.length).toBeLessThanOrEqual(1000);
    }
  });

  it("avoids banned wording in copy", () => {
    const blob = JSON.stringify(blueprintContentSeed);
    expect(BANNED.test(blob)).toBe(false);
  });
});
