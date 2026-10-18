"use client";

import { useRef } from "react";
import { Container } from "@/components/atoms/Container";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { TimelineItem } from "@/components/molecules/TimelineItem";
import { useStoryTimelineScroll } from "@/hooks/useStoryTimelineScroll";
import type { StoryItem } from "@/lib/schemas/story";
import { cn } from "@/lib/utils/cn";

export interface StoryTimelineProps {
  items: StoryItem[];
  className?: string;
}

function formatIndexLabel(order: number): string {
  return String(order + 1).padStart(2, "0");
}

export function StoryTimeline({ items, className }: StoryTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useStoryTimelineScroll({ trackRef, lineRef });

  return (
    <section
      id="story"
      className={cn("border-t border-border py-16 md:py-20", className)}
      aria-labelledby="story-section-label"
    >
      <Container>
        <MonoLabel id="story-section-label" as="p" className="mb-8">
          01 · Story
        </MonoLabel>

        <div
          ref={trackRef}
          className="relative ml-2.5 border-l border-border pl-7 md:pl-8"
        >
          <div
            ref={lineRef}
            aria-hidden
            className="absolute left-0 top-0 h-full w-px origin-top bg-accent"
          />
          <ol className="list-none space-y-0 p-0 m-0">
            {items.map((item) => (
              <li key={item.id}>
                <TimelineItem
                  indexLabel={formatIndexLabel(item.order)}
                  year={item.year}
                  title={item.title}
                  body={item.body}
                  tags={item.tags}
                />
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
