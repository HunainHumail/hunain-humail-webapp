import type { TestimonialSource } from "@/lib/schemas/testimonial";

export const TESTIMONIAL_SOURCE_LABELS: Record<TestimonialSource, string> = {
  linkedin: "LinkedIn",
  upwork: "Upwork",
};

export function testimonialLinkLabel(source: TestimonialSource): string {
  return source === "linkedin" ? "View on LinkedIn" : "View on Upwork";
}
