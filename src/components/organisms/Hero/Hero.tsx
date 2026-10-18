"use client";

import { useRef } from "react";
import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { ChipList } from "@/components/molecules/ChipList";
import { PhotoSlot } from "@/components/molecules/PhotoSlot";
import { Terminal } from "@/components/molecules/Terminal";
import { useGsapLineReveal } from "@/hooks/useGsapLineReveal";
import type { ProfileCta, TerminalLine } from "@/lib/schemas/profile";
import { cn } from "@/lib/utils/cn";

export interface HeroProps {
  name: string;
  headline: string;
  location: string;
  photoUrl?: string;
  chips: string[];
  terminalLines: TerminalLine[];
  ctas: ProfileCta[];
  className?: string;
}

function splitDisplayName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) {
    return { first: name, last: "" };
  }
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

const ctaBase =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-base font-medium no-underline transition-opacity duration-fast ease-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export function Hero({
  name,
  headline,
  location,
  photoUrl,
  chips,
  terminalLines,
  ctas,
  className,
}: HeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useGsapLineReveal(titleRef);
  const { first, last } = splitDisplayName(name);

  return (
    <section
      className={cn("bg-grid-hero py-section md:py-section-lg", className)}
      aria-labelledby="hero-heading"
    >
      <Container>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
            <PhotoSlot name={name} photoUrl={photoUrl} />
            <MonoLabel>{location}</MonoLabel>
            <Heading
              ref={titleRef}
              id="hero-heading"
              level={1}
              size="hero"
            >
              <span className="block overflow-hidden">
                <span data-reveal-line className="inline-block">
                  {first}
                  {last ? null : <span className="text-accent">.</span>}
                </span>
              </span>
              {last ? (
                <span className="block overflow-hidden">
                  <span data-reveal-line className="inline-block">
                    {last}
                    <span className="text-accent">.</span>
                  </span>
                </span>
              ) : null}
            </Heading>
            <Text variant="muted" className="max-w-xl text-lg md:text-xl">
              {headline}
            </Text>
            <ChipList items={chips} />
            <div className="flex flex-wrap gap-3 pt-1">
              {ctas.map((cta, index) => (
                <Link
                  key={`${cta.href}-${cta.label}`}
                  href={cta.href}
                  className={cn(
                    ctaBase,
                    index === 0
                      ? "border border-transparent bg-accent text-accent-contrast hover:opacity-90"
                      : "border border-border bg-surface text-text hover:border-accent",
                  )}
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5 lg:pt-8 xl:min-w-terminal">
            <Terminal lines={terminalLines} />
          </div>
        </div>
      </Container>
    </section>
  );
}
