import { describe, expect, it } from "vitest";
import { buildPersonJsonLd, PERSON_JOB_TITLE, serializeJsonLd } from "./jsonLd";

describe("buildPersonJsonLd", () => {
  it("describes a GenAI engineer and lists social profiles", () => {
    expect(
      buildPersonJsonLd({
        name: "Hunain Humail",
        sameAs: [
          "https://github.com/hunainhumail",
          "https://www.linkedin.com/in/hunainhumail",
          "mailto:raohunain@hotmail.com",
        ],
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Hunain Humail",
      jobTitle: PERSON_JOB_TITLE,
      sameAs: [
        "https://github.com/hunainhumail",
        "https://www.linkedin.com/in/hunainhumail",
        "mailto:raohunain@hotmail.com",
      ],
    });
  });

  it("drops empty profile urls", () => {
    expect(
      buildPersonJsonLd({
        name: "Hunain Humail",
        sameAs: ["", "https://github.com/hunainhumail"],
      }).sameAs,
    ).toEqual(["https://github.com/hunainhumail"]);
  });
});

describe("serializeJsonLd", () => {
  it("escapes angle brackets so the payload cannot close a script tag", () => {
    expect(serializeJsonLd({ name: "</script>" })).toBe(
      '{"name":"\\u003c/script>"}',
    );
  });
});
