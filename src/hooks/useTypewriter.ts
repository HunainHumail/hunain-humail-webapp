"use client";

import { useEffect, useMemo, useState } from "react";
import type { TerminalLine } from "@/lib/schemas/profile";

const DEFAULT_CHAR_MS = 80;
const DEFAULT_LINE_PAUSE_MS = 2200;
const DEFAULT_OUTPUT_DELAY_MS = 200;

export interface UseTypewriterOptions {
  reducedMotion?: boolean;
  charDelayMs?: number;
  linePauseMs?: number;
  outputDelayMs?: number;
}

export interface TypewriterView {
  command: string;
  output: string | null;
  lineIndex: number;
}

function buildFullText(lines: TerminalLine[]): string {
  return lines
    .map((line) => `$ ${line.command}\n${line.output}`)
    .join("\n\n");
}

export function useTypewriter(
  lines: TerminalLine[],
  {
    reducedMotion = false,
    charDelayMs = DEFAULT_CHAR_MS,
    linePauseMs = DEFAULT_LINE_PAUSE_MS,
    outputDelayMs = DEFAULT_OUTPUT_DELAY_MS,
  }: UseTypewriterOptions = {},
): { view: TypewriterView; fullText: string; instantDisplay: string | null } {
  const fullText = useMemo(() => buildFullText(lines), [lines]);

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  const activeLine = lines[lineIndex] ?? lines[0];
  const command = activeLine.command.slice(0, charIndex);

  useEffect(() => {
    if (reducedMotion || lines.length === 0) {
      return undefined;
    }

    const current = lines[lineIndex];
    if (!current) {
      return undefined;
    }

    if (!showOutput) {
      if (charIndex < current.command.length) {
        const timer = window.setTimeout(() => {
          setCharIndex((index) => index + 1);
        }, charDelayMs);
        return () => window.clearTimeout(timer);
      }

      const timer = window.setTimeout(() => {
        setShowOutput(true);
      }, outputDelayMs);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setShowOutput(false);
      setCharIndex(0);
      setLineIndex((index) => (index + 1) % lines.length);
    }, linePauseMs);
    return () => window.clearTimeout(timer);
  }, [
    charDelayMs,
    charIndex,
    lineIndex,
    linePauseMs,
    lines,
    outputDelayMs,
    reducedMotion,
    showOutput,
  ]);

  if (reducedMotion) {
    return {
      fullText,
      instantDisplay: fullText,
      view: {
        lineIndex: 0,
        command: "",
        output: null,
      },
    };
  }

  return {
    fullText,
    instantDisplay: null,
    view: {
      lineIndex,
      command: `$ ${command}`,
      output: showOutput ? activeLine.output : null,
    },
  };
}
