import { testimonialsRepository } from "@/lib/firebase";
import {
  testimonialSchema,
  type Testimonial,
} from "@/lib/schemas/testimonial";
import { testimonialsSeed } from "@/lib/seed/testimonials";
import { listOrSeed, withFirebaseFallback } from "./withFirebaseFallback";

export function publishedTestimonials(items: Testimonial[]): Testimonial[] {
  return items
    .filter((item) => item.status === "published")
    .sort((a, b) => a.order - b.order);
}

function parseTestimonials(items: unknown[]): Testimonial[] {
  return publishedTestimonials(items.map((item) => testimonialSchema.parse(item)));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const seed = () => parseTestimonials(testimonialsSeed);
  return withFirebaseFallback(async () => {
    const items = parseTestimonials(await testimonialsRepository.listPublished());
    return listOrSeed(items, seed());
  }, seed);
}
