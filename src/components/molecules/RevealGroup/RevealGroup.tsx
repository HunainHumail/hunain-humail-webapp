"use client";

import { useRef, type ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export interface RevealGroupProps {
  children: ReactNode;
  className?: string;
}

export function RevealGroup({ children, className }: RevealGroupProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollReveal(rootRef);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
