export const PERSON_JOB_TITLE = "GenAI Engineer";

export interface PersonJsonLdInput {
  name: string;
  sameAs: readonly string[];
}

export interface PersonJsonLd {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  jobTitle: typeof PERSON_JOB_TITLE;
  sameAs: string[];
}

export function buildPersonJsonLd(input: PersonJsonLdInput): PersonJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    jobTitle: PERSON_JOB_TITLE,
    sameAs: [...new Set(input.sameAs.filter((href) => href.length > 0))],
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
