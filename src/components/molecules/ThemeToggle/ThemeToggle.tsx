"use client";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { VisuallyHidden } from "@/components/atoms/VisuallyHidden";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils/cn";

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn("px-2.5", className)}
      onClick={toggleTheme}
      aria-pressed={isDark}
    >
      <Icon name={isDark ? "sun" : "moon"} className="size-5" />
      <VisuallyHidden>
        {isDark ? "Switch to light theme" : "Switch to dark theme"}
      </VisuallyHidden>
    </Button>
  );
}
