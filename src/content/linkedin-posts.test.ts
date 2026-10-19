import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { linkedinPosts } from "@/content/linkedin-posts";
import {
  linkedinPostSchema,
  linkedinPostsSchema,
} from "@/lib/schemas/linkedinPost";
import { LINKEDIN_PROFILE_URL } from "@/lib/utils/rewriteLinkedInUrls";

const banned = (parts: readonly string[]) => new RegExp(parts.join(""), "i");

const BANNED = [
  banned(["hy", "sab"]),
  banned(["co", "[-\\s]?", "founder"]),
  banned(["\\b", "ct", "o", "\\b"]),
  banned(["stu", "dying"]),
  banned(["cer", "tif", "ication"]),
];

describe("linkedinPosts", () => {
  it("parses with zod and lists newest first", () => {
    const parsed = linkedinPostsSchema.parse(linkedinPosts);
    expect(parsed).toHaveLength(3);
    expect(parsed.map((post) => post.date)).toEqual([
      "2026-10-16",
      "2026-10-05",
      "2026-09-26",
    ]);
    expect(parsed.map((post) => post.title)).toEqual([
      "OpenAI DevDay Exchange — Community event, Dubai",
      "AWS Summit Dubai",
      "n8n × K2 Horizon hackathon — Dubai Future Accelerators",
    ]);
    for (const post of parsed) {
      expect(linkedinPostSchema.parse(post).url).toMatch(
        /^https:\/\/www\.linkedin\.com\/feed\/update\//,
      );
      expect(post.url).not.toBe(LINKEDIN_PROFILE_URL);
    }
  });

  it("points each image at a public webp", () => {
    for (const post of linkedinPosts) {
      const relative = post.image.replace(/^\//, "");
      expect(existsSync(resolve(process.cwd(), "public", relative))).toBe(true);
    }
  });

  it("omits banned phrases", () => {
    const blob = linkedinPosts
      .flatMap((post) => [post.title, post.alt, post.excerpt ?? ""])
      .join("\n");
    for (const pattern of BANNED) {
      expect(blob).not.toMatch(pattern);
    }
  });
});
