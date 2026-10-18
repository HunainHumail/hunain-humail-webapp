import { describe, expect, it } from "vitest";
import { resolveExternalHref } from "./resolveExternalHref";

const LINKEDIN = "https://www.linkedin.com/in/hunain-humail";

describe("resolveExternalHref", () => {
  it("keeps absolute https, mailto, and github urls unchanged", () => {
    expect(resolveExternalHref(LINKEDIN)).toBe(LINKEDIN);
    expect(resolveExternalHref("https://github.com/hunainhumail")).toBe(
      "https://github.com/hunainhumail",
    );
    expect(resolveExternalHref("mailto:raohunain@hotmail.com")).toBe(
      "mailto:raohunain@hotmail.com",
    );
    expect(resolveExternalHref(`${LINKEDIN}/`)).toBe(`${LINKEDIN}/`);
  });

  it("promotes protocol-relative and bare hosts to https", () => {
    expect(resolveExternalHref("//www.linkedin.com/in/hunain-humail")).toBe(
      LINKEDIN,
    );
    expect(resolveExternalHref("linkedin.com/in/hunain-humail")).toBe(
      "https://linkedin.com/in/hunain-humail",
    );
    expect(resolveExternalHref("x.com/hunainhumail")).toBe(
      "https://x.com/hunainhumail",
    );
  });

  it("leaves app paths and hashes for the router", () => {
    expect(resolveExternalHref("/work")).toBeNull();
    expect(resolveExternalHref("#contact")).toBeNull();
    expect(resolveExternalHref("/work/trinnect")).toBeNull();
  });
});
