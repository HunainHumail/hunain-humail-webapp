"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { ChipList } from "@/components/molecules/ChipList";
import { PhotoSlot } from "@/components/molecules/PhotoSlot";
import { Terminal } from "@/components/molecules/Terminal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
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
  const reducedMotion = useReducedMotion();
  const { first, last } = splitDisplayName(name);

  const fade = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section className={cn("py-16 md:py-20", className)} aria-labelledby="hero-heading">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr_minmax(16rem,22rem)] lg:gap-12">
          <motion.div {...fade}>
            <PhotoSlot name={name} photoUrl={photoUrl} />
          </motion.div>

          <motion.div className="flex min-w-0 flex-col gap-5" {...fade}>
            <MonoLabel>{location}</MonoLabel>
            <Heading
              id="hero-heading"
              level={1}
              size="display"
              className="leading-[0.9] tracking-tight"
            >
              {first}
              {last ? (
                <>
                  <br />
                  {last}
                </>
              ) : null}
              <span className="text-accent">.</span>
            </Heading>
            <Text variant="muted" className="max-w-xl text-lg md:text-xl">
              {headline}
            </Text>
            <ChipList items={chips} />
            <div className="flex flex-wrap gap-3 pt-1">
              {ctas.map((cta, index) => (
                <Link
                  key={cta.href}
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
          </motion.div>

          <motion.div className="lg:justify-self-end" {...fade}>
            <Terminal lines={terminalLines} className="w-full lg:max-w-sm" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
