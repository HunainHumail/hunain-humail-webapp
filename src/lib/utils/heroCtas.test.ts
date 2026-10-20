import { describe, expect, it } from "vitest";
import { heroCtas } from "./heroCtas";

describe("heroCtas", () => {
  const ctas = [
    { label: "Work", href: "#work" },
    { label: "Blueprint", href: "/#blueprint" },
  ] as const;

  it("drops blueprint CTAs when disabled", () => {
    expect(heroCtas(ctas, false)).toEqual([{ label: "Work", href: "#work" }]);
  });

  it("keeps all CTAs when enabled", () => {
    expect(heroCtas(ctas, true)).toHaveLength(2);
  });
});
