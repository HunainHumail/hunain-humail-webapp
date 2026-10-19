import { describe, expect, it } from "vitest";
import { testimonialSchema } from "./testimonial";

const valid = {
  id: "testimonial-ada",
  name: "Ada Lovelace",
  role: "Engineering lead, Analytical Engines",
  source: "linkedin",
  text: "Clear thinking on agentic workflows.",
  date: "2026-03-01",
  order: 0,
  status: "published",
  updatedAt: "2026-10-18T00:00:00.000Z",
};

describe("testimonialSchema", () => {
  it("accepts a LinkedIn recommendation without a rating", () => {
    const parsed = testimonialSchema.parse(valid);
    expect(parsed.source).toBe("linkedin");
    expect(parsed.rating).toBeUndefined();
    expect(parsed.link).toBeUndefined();
    expect(parsed.avatarUrl).toBeUndefined();
  });

  it("accepts an Upwork review with a 1–5 rating and optional fields", () => {
    const parsed = testimonialSchema.parse({
      ...valid,
      source: "upwork",
      rating: 5,
      avatarUrl: "https://cdn.example/ada.webp",
      link: "https://www.upwork.com/freelancers/~ada",
    });
    expect(parsed.rating).toBe(5);
    expect(parsed.avatarUrl).toBe("https://cdn.example/ada.webp");
    expect(parsed.link).toBe("https://www.upwork.com/freelancers/~ada");
  });

  it("coerces a select-string rating to a number", () => {
    expect(testimonialSchema.parse({ ...valid, rating: "4" }).rating).toBe(4);
  });

  it("treats an empty rating as omitted", () => {
    expect(testimonialSchema.parse({ ...valid, rating: "" }).rating).toBeUndefined();
  });

  it("rejects a rating outside 1–5", () => {
    expect(testimonialSchema.safeParse({ ...valid, rating: 0 }).success).toBe(
      false,
    );
    expect(testimonialSchema.safeParse({ ...valid, rating: 6 }).success).toBe(
      false,
    );
  });

  it("rejects an unknown source", () => {
    expect(
      testimonialSchema.safeParse({ ...valid, source: "twitter" }).success,
    ).toBe(false);
  });

  it("rejects an avatar that is not a path or https URL", () => {
    expect(
      testimonialSchema.safeParse({
        ...valid,
        avatarUrl: "ftp://example.com/ada.webp",
      }).success,
    ).toBe(false);
  });

  it("accepts a relative avatar path", () => {
    expect(
      testimonialSchema.parse({ ...valid, avatarUrl: "/avatars/ada.webp" })
        .avatarUrl,
    ).toBe("/avatars/ada.webp");
  });
});
