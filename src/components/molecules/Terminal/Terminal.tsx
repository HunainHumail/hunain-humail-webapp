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
  const showTranscript = instantDisplay !== null;

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface xl:min-w-terminal",
        className,
      )}
      role="group"
      aria-label="Terminal"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2 rounded-full bg-muted" />
          <span className="size-2 rounded-full bg-muted" />
          <span className="size-2 rounded-full bg-accent" />
        </span>
      </div>
      {showTranscript ? null : <VisuallyHidden>{fullText}</VisuallyHidden>}
      <pre
        className="m-0 min-h-48 flex-1 overflow-x-auto whitespace-pre-wrap break-words px-5 py-4 font-mono text-mono-md text-accent"
        aria-live="off"
        aria-hidden={showTranscript ? undefined : true}
      >
        {instantDisplay ?? (
          <>
            {view.command}
            <span
              className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-accent align-text-bottom motion-safe:animate-caret"
              aria-hidden
            />
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
