import { describe, expect, it } from "vitest";
import { linkedinPosts } from "@/content/linkedin-posts";
import { linkedinPostSchema, linkedinPostsSchema } from "./linkedinPost";

const valid = linkedinPosts[0];

describe("linkedinPostSchema", () => {
  it("accepts a weekly LinkedIn post", () => {
    expect(valid).toBeDefined();
    if (!valid) {
      return;
    }
    expect(linkedinPostSchema.parse(valid).title).toBe(valid.title);
  });

  it("rejects a profile URL and a non-webp image path", () => {
    if (!valid) {
      return;
    }
    expect(
      linkedinPostSchema.safeParse({
        ...valid,
        url: "https://www.linkedin.com/in/hunain-humail",
      }).success,
    ).toBe(false);
    expect(
      linkedinPostSchema.safeParse({
        ...valid,
        image: "/projects/trinnect/cover.webp",
      }).success,
    ).toBe(false);
  });
});

describe("linkedinPostsSchema", () => {
  it("rejects posts that are not newest first", () => {
    const reversed = [...linkedinPosts].reverse();
    expect(linkedinPostsSchema.safeParse(reversed).success).toBe(false);
  });
});
