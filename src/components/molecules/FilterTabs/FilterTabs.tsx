"use client";

import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils/cn";

export interface FilterTab<T extends string = string> {
  value: T;
  label: string;
}

export interface FilterTabsProps<T extends string = string> {
  tabs: readonly FilterTab<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label"?: string;
  className?: string;
}

export function FilterTabs<T extends string>({
  tabs,
  value,
  onChange,
  "aria-label": ariaLabel = "Filters",
  className,
}: FilterTabsProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {tabs.map((tab) => {
        const selected = tab.value === value;
        return (
          <Button
            key={tab.value}
            type="button"
            variant={selected ? "primary" : "pill"}
            size="sm"
            aria-pressed={selected}
            className="font-mono text-xs uppercase tracking-wide"
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
}
