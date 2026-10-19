import { Container } from "@/components/atoms/Container";
import { RevealGroup } from "@/components/molecules/RevealGroup";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { TestimonialCard } from "@/components/molecules/TestimonialCard";
import type { Testimonial } from "@/lib/schemas/testimonial";
import { cn } from "@/lib/utils/cn";
import { formatWritingDate } from "@/lib/utils/formatWritingDate";
import {
  TESTIMONIAL_SOURCE_LABELS,
  testimonialLinkLabel,
} from "@/lib/utils/testimonialMeta";

export interface TestimonialsProps {
  items: Testimonial[];
  index?: string;
  label?: string;
  className?: string;
}

export function Testimonials({
  items,
  index = "05",
  label = "Testimonials",
  className,
}: TestimonialsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className={cn("border-t border-border py-section md:py-section-lg", className)}
      aria-labelledby="testimonials-heading"
    >
      <Container>
        <SectionHeader
          index={index}
          eyebrow={label}
          title="What clients say."
          titleId="testimonials-heading"
        />
        <RevealGroup>
          <ul
            className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Testimonials"
          >
            {items.map((item) => (
              <li key={item.id} data-reveal>
                <TestimonialCard
                  name={item.name}
                  role={item.role}
                  sourceLabel={TESTIMONIAL_SOURCE_LABELS[item.source]}
                  text={item.text}
                  dateLabel={formatWritingDate(item.date)}
                  dateTime={item.date}
                  rating={item.rating}
                  avatarUrl={item.avatarUrl}
                  href={item.link}
                  linkLabel={item.link ? testimonialLinkLabel(item.source) : undefined}
                />
              </li>
            ))}
          </ul>
        </RevealGroup>
      </Container>
    </section>
  );
}
