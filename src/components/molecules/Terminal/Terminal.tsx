"use client";

import { VisuallyHidden } from "@/components/atoms/VisuallyHidden";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { TerminalLine } from "@/lib/schemas/profile";
import { cn } from "@/lib/utils/cn";

export interface TerminalProps {
  lines: TerminalLine[];
  className?: string;
}

export function Terminal({ lines, className }: TerminalProps) {
  const reducedMotion = useReducedMotion();
  const { view, fullText, instantDisplay } = useTypewriter(lines, {
    reducedMotion,
  });

  return (
    <div
      className={cn(
        "min-h-16 min-w-0 rounded-lg border border-border bg-bg px-4 py-3 font-mono text-sm text-accent",
        className,
      )}
      role="group"
      aria-label="Terminal"
    >
      <VisuallyHidden>{fullText}</VisuallyHidden>
      <pre
        className="m-0 whitespace-pre-wrap break-words"
        aria-live="off"
        aria-hidden="true"
      >
        {instantDisplay ?? (
          <>
            {view.command}
            {view.output !== null ? (
              <>
                {"\n"}
                <span className="text-muted">{view.output}</span>
              </>
            ) : null}
          </>
        )}
      </pre>
    </div>
  );
}
