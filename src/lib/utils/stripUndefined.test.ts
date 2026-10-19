import { describe, expect, it } from "vitest";
import { stripUndefined } from "./stripUndefined";

describe("stripUndefined", () => {
  it("drops undefined fields and array holes Firestore rejects", () => {
    expect(
      stripUndefined({
        title: "Trinnect",
        company: undefined,
        gallery: [{ src: "/a.webp", alt: "A", caption: undefined }],
        stack: ["React", undefined, "Capacitor"],
      }),
    ).toEqual({
      title: "Trinnect",
      gallery: [{ src: "/a.webp", alt: "A" }],
      stack: ["React", "Capacitor"],
    });
  });
});
