import { describe, expect, it } from "vitest";
import { metadata } from "./layout";

describe("admin layout", () => {
  it("asks crawlers not to index the admin", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.title).toBe("Admin · Hunain Humail");
  });
});
