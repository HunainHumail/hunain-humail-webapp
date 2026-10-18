import { describe, expect, it } from "vitest";
import {
  LINKEDIN_PROFILE_URL,
  rewriteLinkedInInTree,
  rewriteLinkedInUrls,
} from "./rewriteLinkedInUrls";

describe("rewriteLinkedInUrls", () => {
  it("maps every hunain profile variant to the canonical https url", () => {
    expect(LINKEDIN_PROFILE_URL).toBe(
      "https://www.linkedin.com/in/hunain-humail",
    );
    const variants = [
      "https://www.linkedin.com/in/hunainhumail",
      "https://www.linkedin.com/in/hunainhumail/",
      "https://linkedin.com/in/hunain-humail",
      "http://www.linkedin.com/in/hunainhumail",
      "//www.linkedin.com/in/hunainhumail",
      "linkedin.com/in/hunainhumail",
      "www.linkedin.com/in/hunain-humail/",
      LINKEDIN_PROFILE_URL,
    ];
    for (const variant of variants) {
      expect(rewriteLinkedInUrls(variant)).toBe(LINKEDIN_PROFILE_URL);
    }
  });

  it("leaves github, mailto, and the LinkedIn label untouched", () => {
    expect(rewriteLinkedInUrls("https://github.com/hunainhumail")).toBe(
      "https://github.com/hunainhumail",
    );
    expect(rewriteLinkedInUrls("mailto:raohunain@hotmail.com")).toBe(
      "mailto:raohunain@hotmail.com",
    );
    expect(rewriteLinkedInUrls("LinkedIn")).toBe("LinkedIn");
    expect(rewriteLinkedInUrls("https://x.com/hunainhumail")).toBe(
      "https://x.com/hunainhumail",
    );
  });
});

describe("rewriteLinkedInInTree", () => {
  it("rewrites nested hrefs and keeps other fields", () => {
    expect(
      rewriteLinkedInInTree({
        socials: [
          { label: "LinkedIn", href: "https://www.linkedin.com/in/hunainhumail" },
        ],
        url: "linkedin.com/in/hunainhumail",
      }),
    ).toEqual({
      socials: [{ label: "LinkedIn", href: LINKEDIN_PROFILE_URL }],
      url: LINKEDIN_PROFILE_URL,
    });
  });
});
