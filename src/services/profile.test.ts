import { describe, expect, it } from "vitest";
import { getProfile } from "./profile";

describe("getProfile", () => {
  it("returns validated published profile seed", async () => {
    const profile = await getProfile();
    expect(profile.name).toBe("Hunain Humail");
    expect(profile.terminalLines.length).toBeGreaterThan(0);
    expect(profile.ctas[0].label).toBe("View work");
  });
});
