"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";
import { MonoLabel } from "@/components/atoms/MonoLabel";
import { Text } from "@/components/atoms/Text";
import { WireframeScreen } from "@/components/molecules/WireframeScreen";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { BlueprintSpec } from "@/lib/schemas/blueprint";
import { cn } from "@/lib/utils/cn";

export interface BlueprintCanvasProps {
  spec: BlueprintSpec;
  copyLabel: string;
  onCopy?: () => void;
  copied?: boolean;
  actions?: ReactNode;
  className?: string;
}

export function BlueprintCanvas({
  spec,
  copyLabel,
  onCopy,
  copied = false,
  actions,
  className,
}: BlueprintCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollReveal(rootRef);

  return (
    <div ref={rootRef} data-reveal className={cn("flex flex-col gap-6", className)}>
      <div>
        <MonoLabel className="mb-2">{spec.platform}</MonoLabel>
        <Heading level={3} className="mb-2">
          {spec.appName}
        </Heading>
        <Text variant="muted">{spec.summary}</Text>
        <Text as="p" className="mt-3">
          {spec.mvp}
        </Text>
        <Text variant="muted" as="p" className="mt-1">
          {`For ${spec.audience}`}
        </Text>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <MonoLabel className="mb-2">Assumptions</MonoLabel>
          <ul className="list-disc space-y-1 pl-5 text-sm text-text">
            {(spec.assumptions ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <MonoLabel className="mb-2">Later</MonoLabel>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            {(spec.later ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        {spec.screens.map((screen, index) => (
          <div
            key={screen.id}
            className={cn(
              "min-w-0 max-w-full",
              spec.platform === "web" ? "w-wireframe-web" : "w-wireframe",
            )}
          >
            <WireframeScreen
              screen={screen}
              platform={spec.platform}
              index={index}
            />
          </div>
        ))}
      </div>

      <div>
        <MonoLabel className="mb-2">In this version</MonoLabel>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-muted">
          {(spec.features ?? []).map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {onCopy ? (
          <Button type="button" variant="ghost" size="sm" onClick={onCopy}>
            {copied ? "Copied" : copyLabel}
          </Button>
        ) : null}
        {actions}
      </div>
    </div>
  );
}
