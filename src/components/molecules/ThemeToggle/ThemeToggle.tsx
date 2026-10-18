"use client";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { useTheme } from "@/hooks/useTheme";
import { themeToggleLabel } from "@/lib/theme/constants";
import { cn } from "@/lib/utils/cn";

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = themeToggleLabel(theme);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn("px-2.5", className)}
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={label}
    >
      <Icon name={isDark ? "sun" : "moon"} className="size-5" />
    </Button>
  );
}
